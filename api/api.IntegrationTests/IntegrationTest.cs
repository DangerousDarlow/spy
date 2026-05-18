namespace api.IntegrationTests;

public abstract class IntegrationTest
{
    protected HttpClient Client { get; private set; } = null!;
    
    protected Guid PlayerId { get; } = Guid.NewGuid();

    private Uri TargetUrl { get; } = new(TestContext.Parameters.Get("TargetUrl", "http://localhost:7245"));

    [OneTimeSetUp]
    public void CreateClient()
    {
        Client = new HttpClient { BaseAddress = TargetUrl };
        Client.DefaultRequestHeaders.Add("Player-Id", PlayerId.ToString());
        TestContext.Out.WriteLine($"Created HttpClient with base Url {TargetUrl}");
    }

    [OneTimeTearDown]
    public void DisposeClient()
    {
        Client.Dispose();
    }
}