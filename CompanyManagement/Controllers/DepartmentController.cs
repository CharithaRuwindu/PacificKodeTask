using CompanyManagement.Data;
using CompanyManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompanyManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DepartmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] Department department)
        {
            if (department == null)
                return BadRequest("Invalid data.");

            if (await _context.Departments.AnyAsync(d => d.DepartmentCode == department.DepartmentCode))
                return Conflict("Department Code already exists.");

            if (await _context.Departments.AnyAsync(d => d.DepartmentName == department.DepartmentName))
                return Conflict("Department Name already exists.");

            department.Id = Guid.NewGuid();

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDepartmentById), new { id = department.Id }, department);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(Guid id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            return Ok(department);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartments()
        {
            var departments = await _context.Departments.ToListAsync();
            return Ok(departments);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(Guid id, [FromBody] Department updatedDepartment)
        {
            var existingDepartment = await _context.Departments.FindAsync(id);
            if (existingDepartment == null)
                return NotFound();

            bool isCodeChanged = existingDepartment.DepartmentCode != updatedDepartment.DepartmentCode;
            bool isNameChanged = existingDepartment.DepartmentName != updatedDepartment.DepartmentName;

            if (isCodeChanged && !isNameChanged) // Only DepartmentCode changed
            {
                if (await _context.Departments.AnyAsync(d => d.DepartmentCode == updatedDepartment.DepartmentCode && d.Id != id))
                    return Conflict("Department Code already exists.");
            }
            else if (!isCodeChanged && isNameChanged) // Only DepartmentName changed
            {
                if (await _context.Departments.AnyAsync(d => d.DepartmentName == updatedDepartment.DepartmentName && d.Id != id))
                    return Conflict("Department Name already exists.");
            }
            else if (isCodeChanged && isNameChanged) // Both changed
            {
                if (await _context.Departments.AnyAsync(d => d.DepartmentCode == updatedDepartment.DepartmentCode && d.Id != id))
                    return Conflict("Department Code already exists.");

                if (await _context.Departments.AnyAsync(d => d.DepartmentName == updatedDepartment.DepartmentName && d.Id != id))
                    return Conflict("Department Name already exists.");
            }

            existingDepartment.DepartmentCode = updatedDepartment.DepartmentCode;
            existingDepartment.DepartmentName = updatedDepartment.DepartmentName;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(Guid id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
