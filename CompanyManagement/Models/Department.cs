using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CompanyManagement.Models
{
    public class Department
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Department Code is required")]
        [StringLength(10, ErrorMessage = "Department Code cannot exceed 10 characters")]
        public string DepartmentCode { get; set; }

        [Required(ErrorMessage = "Department Name is required")]
        [StringLength(50, ErrorMessage = "Department Name cannot exceed 50 characters")]
        public string DepartmentName { get; set; }
    }
}
