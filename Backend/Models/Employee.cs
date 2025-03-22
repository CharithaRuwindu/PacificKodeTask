using System;
namespace Backend.Models
{
    public class Employee
    {
        public Guid EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public DateTime DateOfBirth { get; set; }
        public decimal Salary { get; set; }
        public Guid DepartmentId { get; set; }
        public int Age { get; set; }
    }

}
