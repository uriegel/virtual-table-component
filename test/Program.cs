using System;
using System.IO;
using System.Threading.Tasks;
using CsTools.Extensions;
using WebServerLight;
using WebServerLight.Routing;

var port = 9882;

WebServer
    .New()
    .Logging(LogLevel.Trace)
    .Http(port)
    .Route(MethodRoute
        .New(Method.Get)
        .Request(GetFile))
    .Build()
    .Start();

Console.WriteLine($"Running test server on http://localhost:{port}/test/index.html");
Console.ReadLine(); 


static async Task<bool> GetFile(IRequest request)
{
    try
    {
        var subPath = request.Url[1..];
        if (subPath == null)
            return false;
        using var stream = File.OpenRead(subPath);

        await request.SendAsync(stream, stream.Length, subPath?.GetFileExtension()?.ToMimeType() ?? "text/plain", new FileInfo(stream.Name).LastWriteTime);
        return true;
    }
    catch (Exception)
    {
        return false;
    }
}
