using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Instructions
{
    public class CreateInstructionDto
    {
        public required string Text { get; set; }
    }
}