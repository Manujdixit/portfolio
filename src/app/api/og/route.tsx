import { ImageResponse } from "next/og";
import { DATA } from "@/data/resume";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") || "Manuj Dixit - Full Stack Developer";
  const description = searchParams.get("description") || DATA.description;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          <h1
            style={{
              fontSize: "60px",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "20px",
              lineHeight: "1.1",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "30px",
              color: "#cccccc",
              marginBottom: "40px",
              lineHeight: "1.4",
            }}
          >
            {description}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000000",
              }}
            >
              {DATA.initials}
            </div>
            <div>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  margin: "0",
                }}
              >
                {DATA.name}
              </p>
              <p
                style={{
                  fontSize: "18px",
                  color: "#888888",
                  margin: "0",
                }}
              >
                Full Stack Developer
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
