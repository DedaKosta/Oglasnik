using Oglasnik.Contracts.Records.Auth.Login;
using FastEndpoints;
using Oglasnik.Data;
using Microsoft.EntityFrameworkCore;

namespace Oglasnik.WebAPI.Endpoints.Auth;

public class Login : Endpoint<LoginRequestRecord, LoginResponseRecord>
{

	// TODO: Move this temp functionality into appropriate service
	private readonly DatabaseContext _dbContext;

	public Login(DatabaseContext dbContext)
	{
		_dbContext = dbContext;
	}

	public override void Configure()
	{
		Post("/api/login");
		AllowAnonymous();
	}

	public override async Task HandleAsync(LoginRequestRecord request, CancellationToken cancellationToken)
	{

		// TODO: To be removed, added for testing purposes
		var existingUser = await _dbContext.UserAccounts
			.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

		if (existingUser == null)
		{
			await Send.NotFoundAsync(cancellationToken);
			return;
		}

		var response = new LoginResponseRecord(
			existingUser.Id,
			existingUser.Username,
			existingUser.Email,
			existingUser.FirstName,
			existingUser.LastName
		);

		await Send.OkAsync(response, cancellationToken);
	}
}
