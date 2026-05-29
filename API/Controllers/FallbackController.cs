using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class FallbackController : Controller
    {
        [Route("{*path}")]
        public IActionResult Index()
        {

            var path = Request.Path.Value ?? "";

            // ❌ don't override API, swagger, or openapi
            if (path.StartsWith("/api") ||
                path.StartsWith("/swagger") ||
                path.StartsWith("/openapi"))
            {
                return NotFound();
            }

            return PhysicalFile(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"),
                "text/html"
            );
        }
    }
}