using CompanyManagement.Models;
using CompanyManagement.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CompanyManagement.Controllers
{
    [Route("api/departments")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentRepository _repository;

        public DepartmentController(DepartmentRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments() => Ok(await _repository.GetDepartmentsAsync());

        [HttpPost]
        public async Task<IActionResult> AddDepartment([FromBody] Department department)
        {
            await _repository.AddDepartmentAsync(department);
            return Ok(new { message = "Department added successfully." });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateDepartment([FromBody] Department department)
        {
            await _repository.UpdateDepartmentAsync(department);
            return Ok(new { message = "Department updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            await _repository.DeleteDepartmentAsync(id);
            return Ok(new { message = "Department deleted successfully." });
        }
    }
}
