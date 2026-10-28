using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SubTrack.API.DTOS;
using SubTrack.API.Services;
using System.Security.Claims;

namespace SubTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionService _service;

        public SubscriptionsController(ISubscriptionService service)
        {
            _service = service;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync(UserId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id, UserId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
        {
            var result = await _service.CreateAsync(dto, UserId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSubscriptionDto dto)
        {
            var result = await _service.UpdateAsync(id, dto, UserId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id, UserId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var result = await _service.GetDashboardAsync(UserId);
            return Ok(result);
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcoming([FromQuery] int days = 30)
        {
            var result = await _service.GetUpcomingRenewalsAsync(UserId, days);
            return Ok(result);
        }
    }
}
