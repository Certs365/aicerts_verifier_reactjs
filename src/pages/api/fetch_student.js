async function fetchFromAPI(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Failed to fetch from API. Status: ${response.status}`);
    }
    return response.json();
}

function convertToMMDDYYYY(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests are allowed" });
    }

    const { data } = req.body;
    console.log(data)
    if (
        !data ||
        !data["Certificate Number"] ||
        !data.Name ||
        !data["Course Name"] ||
        !data["Grant Date"]
    ) {
        return res.status(400).json({ error: "Missing required fields in request body" });
    }

    try {
        // Fetch login data
        const loginData = await fetchFromAPI(
            `${process.env.NEXT_PUBLIC_BASE_URL_USER}/api/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email:process.env.NEXT_PUBLIC_ISSUER_EMAIL,
                    password: process.env.NEXT_PUBLIC_ISSUER_PASS,
                }),
            }
        );

        console.log("Login data:", loginData);

        // Prepare the certificate issuance request payload
        const issuancePayload = {
            email: process.env.NEXT_PUBLIC_ISSUER_EMAIL,
            certificateNumber: data["Certificate Number"],
            name: data.Name,
            course: data["Course Name"],
            grantDate: data["Grant Date"],
            expirationDate: "1",
            flag: false,
        };

        console.log("Issuance payload:", issuancePayload);

        // Issue certificate
        const issuanceResponse = await fetchFromAPI(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/issuance`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginData.data.JWTToken}`,
                },
                body: JSON.stringify(issuancePayload),
            }
        );

        console.log("Issuance response:", issuanceResponse);

        // Extract QR code URL
        const qrUrl = issuanceResponse.qrCodeImage;

        // Respond with certificate details and QR code URL
        res.status(200).json({
            qrUrl,
        });
    } catch (error) {
        console.error("Error in certificate issuance handler:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
