using System;

namespace Backend.Models
{
    public class Department
    {
        public Guid Id { get; set; }
        public string DepartmentCode { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
    }
}
