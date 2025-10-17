using FastEndpoints;
using Oglasnik.Contracts.Records.Healthcheck;
using Oglasnik.Contracts.Enums;

namespace OglasnikApi.Endpoints.Healthcheck;

public class Health : EndpointWithoutRequest<HealthcheckResponseRecord>
{
	public override void Configure()
	{
		Get("/api/health");
		Roles(AccountTypes.Admin.ToString());
	}

	public override async Task HandleAsync(CancellationToken cancellationToken)
	{
		string message = "The application is healthy";
		await Send.OkAsync(new HealthcheckResponseRecord(message), cancellationToken);
	}
}