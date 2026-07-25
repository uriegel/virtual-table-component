using System;
using System.Threading.Tasks;
using WebServerLight;
using WebServerLight.Routing;

var port = 9882;

WebServer
    .New()
    .Logging(LogLevel.Error)
    .Http(port)
    .Route(MethodRoute
        .New(Method.Get)
        .Add(PathRoute
            .New("/test/image")
            .Request(GetImage))        
        .Add(WebSiteRoute.New()))
    .Build()
    .Start();

Console.WriteLine($"Running test server on http://localhost:{port}/test/index.html");
Console.ReadLine();

static async Task<bool> GetImage(IRequest request)
{
    var icon = request.SubPath;
    await request.SendResourceAsync(icon, MimeTypes.ImageJpeg);
    return true;
}

