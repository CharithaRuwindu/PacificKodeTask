using System.ComponentModel.DataAnnotations;

namespace CompanyManagement.Models
{
    public class Department
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string DepartmentCode { get; set; }

        [Required, MaxLength(100)]
        public string DepartmentName { get; set; }
    }
}
