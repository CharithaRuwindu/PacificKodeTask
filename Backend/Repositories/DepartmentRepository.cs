using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.Extensions.Configuration;

namespace Backend.Repositories
{
    public class DepartmentRepository
    {
        private readonly string _connectionString;

        public DepartmentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Department>> GetDepartmentsAsync()
        {
            var departments = new List<Department>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Departments", conn))
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        departments.Add(new Department
                        {
                            Id = reader.GetGuid(0),
                            DepartmentCode = reader.GetString(1),
                            DepartmentName = reader.GetString(2)
                        });
                    }
                }
            }
            return departments;
        }

        public async Task<Department> GetDepartmentByIdAsync(Guid id)
        {
            Department department = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("SELECT * FROM Departments WHERE Id = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            department = new Department
                            {
                                Id = reader.GetGuid(0),
                                DepartmentCode = reader.GetString(1),
                                DepartmentName = reader.GetString(2)
                            };
                        }
                    }
                }
            }
            return department;
        }

        public async Task AddDepartmentAsync(Department department)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Departments (Id, DepartmentCode, DepartmentName) VALUES (@Id, @Code, @Name)", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", Guid.NewGuid());
                    cmd.Parameters.AddWithValue("@Code", department.DepartmentCode);
                    cmd.Parameters.AddWithValue("@Name", department.DepartmentName);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task UpdateDepartmentAsync(Guid id, string departmentCode, string departmentName)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(
                    "UPDATE Departments SET DepartmentCode = @Code, DepartmentName = @Name WHERE Id = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Code", departmentCode);
                    cmd.Parameters.AddWithValue("@Name", departmentName);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task DeleteDepartmentAsync(Guid id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                using (SqlCommand checkCmd = new SqlCommand("SELECT COUNT(*) FROM Employees WHERE DepartmentId = @Id", conn))
                {
                    checkCmd.Parameters.AddWithValue("@Id", id);
                    int employeeCount = (int)await checkCmd.ExecuteScalarAsync();

                    if (employeeCount > 0)
                    {
                        throw new InvalidOperationException("Cannot delete department because it has assigned employees.");
                    }
                }

                using (SqlCommand cmd = new SqlCommand("DELETE FROM Departments WHERE Id = @Id", conn))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
    }
}
