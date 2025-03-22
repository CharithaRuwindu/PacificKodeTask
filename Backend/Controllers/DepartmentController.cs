using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly string _connectionString;

        public DepartmentController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] Department department)
        {
            if (department == null)
                return BadRequest("Invalid data.");

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var command = new SqlCommand("SELECT COUNT(*) FROM Departments WHERE DepartmentCode = @DepartmentCode OR DepartmentName = @DepartmentName", connection);
            command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
            command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);

            int count = (int)await command.ExecuteScalarAsync();
            if (count > 0)
                return Conflict("Department Code or Name already exists.");

            department.Id = Guid.NewGuid();
            command = new SqlCommand("INSERT INTO Departments (Id, DepartmentCode, DepartmentName) VALUES (@Id, @DepartmentCode, @DepartmentName)", connection);
            command.Parameters.AddWithValue("@Id", department.Id);
            command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
            command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);

            await command.ExecuteNonQueryAsync();
            return CreatedAtAction(nameof(GetDepartmentById), new { id = department.Id }, department);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var command = new SqlCommand("SELECT * FROM Departments WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            using var reader = await command.ExecuteReaderAsync();

            if (!reader.Read())
                return NotFound();

            var department = new Department
            {
                Id = reader.GetGuid(0),
                DepartmentCode = reader.GetString(1),
                DepartmentName = reader.GetString(2)
            };

            return Ok(department);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartments()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            var command = new SqlCommand("SELECT * FROM Departments", connection);
            using var reader = await command.ExecuteReaderAsync();
            var departments = new List<Department>();

            while (reader.Read())
            {
                departments.Add(new Department
                {
                    Id = reader.GetGuid(0),
                    DepartmentCode = reader.GetString(1),
                    DepartmentName = reader.GetString(2)
                });
            }

            return Ok(departments);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(Guid id, [FromBody] Department updatedDepartment)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var command = new SqlCommand("SELECT DepartmentCode, DepartmentName FROM Departments WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            using var reader = await command.ExecuteReaderAsync();

            if (!reader.Read())
                return NotFound();

            string currentCode = reader.GetString(0);
            string currentName = reader.GetString(1);
            reader.Close();

            bool isCodeChanged = currentCode != updatedDepartment.DepartmentCode;
            bool isNameChanged = currentName != updatedDepartment.DepartmentName;

            if (isCodeChanged && !isNameChanged)
            {
                command = new SqlCommand("SELECT COUNT(*) FROM Departments WHERE DepartmentCode = @DepartmentCode AND Id != @Id", connection);
                command.Parameters.AddWithValue("@DepartmentCode", updatedDepartment.DepartmentCode);
                command.Parameters.AddWithValue("@Id", id);
                if ((int)await command.ExecuteScalarAsync() > 0)
                    return Conflict("Department Code already exists.");
            }
            else if (!isCodeChanged && isNameChanged)
            {
                command = new SqlCommand("SELECT COUNT(*) FROM Departments WHERE DepartmentName = @DepartmentName AND Id != @Id", connection);
                command.Parameters.AddWithValue("@DepartmentName", updatedDepartment.DepartmentName);
                command.Parameters.AddWithValue("@Id", id);
                if ((int)await command.ExecuteScalarAsync() > 0)
                    return Conflict("Department Name already exists.");
            }
            else if (isCodeChanged && isNameChanged)
            {
                command = new SqlCommand("SELECT COUNT(*) FROM Departments WHERE (DepartmentCode = @DepartmentCode OR DepartmentName = @DepartmentName) AND Id != @Id", connection);
                command.Parameters.AddWithValue("@DepartmentCode", updatedDepartment.DepartmentCode);
                command.Parameters.AddWithValue("@DepartmentName", updatedDepartment.DepartmentName);
                command.Parameters.AddWithValue("@Id", id);
                if ((int)await command.ExecuteScalarAsync() > 0)
                    return Conflict("Department Code or Name already exists.");
            }

            command = new SqlCommand("UPDATE Departments SET DepartmentCode = @DepartmentCode, DepartmentName = @DepartmentName WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@DepartmentCode", updatedDepartment.DepartmentCode);
            command.Parameters.AddWithValue("@DepartmentName", updatedDepartment.DepartmentName);
            await command.ExecuteNonQueryAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var checkCommand = new SqlCommand("SELECT COUNT(*) FROM Employees WHERE DepartmentId = @Id", connection);
            checkCommand.Parameters.AddWithValue("@Id", id);
            int employeeCount = (int)await checkCommand.ExecuteScalarAsync();

            if (employeeCount > 0)
            {
                return BadRequest("Cannot delete department because it has assigned employees.");
            }

            using var command = new SqlCommand("DELETE FROM Departments WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            int rowsAffected = await command.ExecuteNonQueryAsync();

            return rowsAffected > 0 ? NoContent() : NotFound();
        }

    }
}
