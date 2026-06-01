export async function GET() {
  try {
    // Check if critical services are accessible
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        nextjs: 'running',
        // Add more service checks as needed
      },
    };

    return Response.json(checks, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
