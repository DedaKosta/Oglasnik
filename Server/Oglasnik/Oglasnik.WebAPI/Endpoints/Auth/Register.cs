using FastEndpoints;
using Oglasnik.Contracts.Records.Auth.Register;

namespace OglasnikApi.Endpoints.Auth;

public class Register : Endpoint<RegisterRequestRecord, RegisterResponseRecord>
{
	public override void Configure()
	{
		Post("/api/register");
		AllowAnonymous();
	}

	public override async Task HandleAsync(RegisterRequestRecord request, CancellationToken cancellationToken)
	{
		await Send.OkAsync(new RegisterResponseRecord(1, request.Username, request.Email, request.FirstName, request.LastName), cancellationToken);
	}
}
