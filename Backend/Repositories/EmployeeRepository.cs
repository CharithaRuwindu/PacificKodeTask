using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.Extensions.Configuration;

namespace Backend.Repositories
{
    public class EmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private bool IsValidEmail(string email)
        {
            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, emailPattern);
        }

        public async Task<List<Employee>> GetEmployeesAsync()
        {
            var employees = new List<Employee>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Employees", conn))
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var employee = new Employee
                        {
                            EmployeeId = reader.GetGuid(0),
                            FirstName = reader.GetString(1),
                            LastName = reader.GetString(2),
                            EmailAddress = reader.GetString(3),
                            DateOfBirth = reader.GetDateTime(4),
                            Salary = reader.GetDecimal(5),
                            DepartmentId = reader.GetGuid(6)
                        };

                        employee.Age = CalculateAge(employee.DateOfBirth);

                        employees.Add(employee);
                    }
                }
            }
            return employees;
        }

        public async Task<Employee> GetEmployeeByIdAsync(Guid id)
        {
            Employee employee = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Employees WHERE EmployeeId = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            employee = new Employee
                            {
                                EmployeeId = reader.GetGuid(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                EmailAddress = reader.GetString(3),
                                DateOfBirth = reader.GetDateTime(4),
                                Salary = reader.GetDecimal(5),
                                DepartmentId = reader.GetGuid(6)
                            };

                            employee.Age = CalculateAge(employee.DateOfBirth);
                        }
                    }
                }
            }
            return employee;
        }

        public async Task AddEmployeeAsync(Employee employee)
        {
            if (string.IsNullOrEmpty(employee.FirstName) || string.IsNullOrEmpty(employee.LastName) ||
                string.IsNullOrEmpty(employee.EmailAddress) || employee.DateOfBirth == DateTime.MinValue ||
                employee.Salary <= 0 || employee.DepartmentId == Guid.Empty)
            {
                throw new ArgumentException("All fields are required.");
            }

            if (!IsValidEmail(employee.EmailAddress))
            {
                throw new ArgumentException("Invalid email format.");
            }

            if (await IsEmailExistsAsync(employee.EmailAddress))
            {
                throw new ArgumentException("Email address already exists.");
            }

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Employees (EmployeeId, FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentId) VALUES (@EmployeeId, @FirstName, @LastName, @EmailAddress, @DateOfBirth, @Salary, @DepartmentId)", conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeId", Guid.NewGuid());
                    cmd.Parameters.AddWithValue("@FirstName", employee.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", employee.LastName);
                    cmd.Parameters.AddWithValue("@EmailAddress", employee.EmailAddress);
                    cmd.Parameters.AddWithValue("@DateOfBirth", employee.DateOfBirth);
                    cmd.Parameters.AddWithValue("@Salary", employee.Salary);
                    cmd.Parameters.AddWithValue("@DepartmentId", employee.DepartmentId);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task UpdateEmployeeAsync(Guid id, string firstName, string lastName, string emailAddress, DateTime dateOfBirth, decimal salary, Guid departmentId)
        {
            // Validate required fields
            if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName) ||
                string.IsNullOrEmpty(emailAddress) || dateOfBirth == DateTime.MinValue ||
                salary <= 0 || departmentId == Guid.Empty)
            {
                throw new ArgumentException("All fields are required.");
            }

            if (!IsValidEmail(emailAddress))
            {
                throw new ArgumentException("Invalid email format.");
            }

            if (await IsEmailExistsAsync(emailAddress, id))
            {
                throw new ArgumentException("Email address already exists.");
            }

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(
                    "UPDATE Employees SET FirstName = @FirstName, LastName = @LastName, EmailAddress = @EmailAddress, DateOfBirth = @DateOfBirth, Salary = @Salary, DepartmentId = @DepartmentId WHERE EmployeeId = @EmployeeId", conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeId", id);
                    cmd.Parameters.AddWithValue("@FirstName", firstName);
                    cmd.Parameters.AddWithValue("@LastName", lastName);
                    cmd.Parameters.AddWithValue("@EmailAddress", emailAddress);
                    cmd.Parameters.AddWithValue("@DateOfBirth", dateOfBirth);
                    cmd.Parameters.AddWithValue("@Salary", salary);
                    cmd.Parameters.AddWithValue("@DepartmentId", departmentId);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task DeleteEmployeeAsync(Guid id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("DELETE FROM Employees WHERE EmployeeId = @EmployeeId", conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeId", id);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        private async Task<bool> IsEmailExistsAsync(string email, Guid? employeeId = null)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Employees WHERE EmailAddress = @EmailAddress AND (@EmployeeId IS NULL OR EmployeeId != @EmployeeId)", conn))
                {
                    cmd.Parameters.AddWithValue("@EmailAddress", email);
                    cmd.Parameters.AddWithValue("@EmployeeId", employeeId ?? Guid.Empty);
                    int count = (int)await cmd.ExecuteScalarAsync();
                    return count > 0;
                }
            }
        }

        private int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}
