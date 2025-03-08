using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly AzureBlobStorageService _blobStorageService;

        public ImagesController(AzureBlobStorageService blobStorageService)
        {
            _blobStorageService = blobStorageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(ImageDto file)
        {
            if (file == null || file.ImageFile?.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Generate a unique file name
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.ImageFile?.FileName)}";

            // Upload the file to Azure Blob Storage
            using (var stream = file.ImageFile?.OpenReadStream())
            {
                var imageUrl = await _blobStorageService.UploadFileAsync(stream, fileName);
                return Ok(new { ImageUrl = imageUrl });
            }
        }
    }
}