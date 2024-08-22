
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'


export const config = {
    runtime: 'experimental-edge',
}

const handle = (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const certificatenumber = searchParams.get('certificatenumber') || "-"
    const coursename = searchParams.get('coursename') || '-'
    const grantdate = searchParams.get('grantdate') || "-"
    const expirationDate = searchParams.get('expirationdate') || "-"
    const name = searchParams.get('name') || '-'
    const baseUrl = req.nextUrl.origin

    return new ImageResponse(
        (
            
            <div
                style={{
                    backgroundColor: '#F3F4F6',
                    padding: '40px',
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <div
                    style={{
                        backgroundColor: '#1C1F30',
                        border: 'none',
                        padding: '30px 40px 30px 0',
                        marginBottom: '50px',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            right: '25px',
                            top: '25px',
                            backgroundImage: `url(${baseUrl}/backgrounds/varified-certificate-badge.gif)`,
                            width: '80px',
                            height: '80px',
                            backgroundRepeat: 'no-repeat',
                            display: 'flex',

                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',

                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                width: '190px',
                                height: '150px',
                                margin: '0',
                                display: 'flex',

                            }}
                        >
                            <img
                                src={`${baseUrl}/backgrounds/varified-certificate-badge.gif`}
                                alt="Badge Banner"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', position: 'relative' }}>
                            <div style={{
                                padding: '20px',
                                display: 'flex',
                                flexDirection: "column"

                            }}>
                                <div
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        marginBottom: '10px',
                                    }}
                                >
                                    Certification Number
                                </div>
                                <div
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: '16px',
                                        fontWeight: 400,
                                    }}
                                >
                                    {certificatenumber || ""}
                                </div>
                            </div>
                            <div style={{
                                padding: '20px',
                                display: 'flex',
                                flexDirection: "column"


                            }}>
                                <div
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: '16px',
                                        fontWeight: 900,
                                        marginBottom: '10px',
                                    }}
                                >
                                    Certification Name
                                </div>
                                <div
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: '16px',
                                        fontWeight: 400,
                                    }}
                                >
                                    {coursename || ""}
                                </div>
                            </div>
                            {/* <hr
                                style={{
                                    height: '2px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.50)',
                                    margin: '16px 0',
                                    width: '100%',
                                }}
                            /> */}
                            {/* <hr
                                style={{
                                    width: '2px',
                                    height: '100%',
                                    transform: 'rotate(180deg)',
                                    position: 'absolute',
                                    left: '50%',
                                    margin: '0',
                                    padding: '0',
                                }}
                            /> */}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                        marginBottom: '0',
                    }}
                >
                    <div style={{
                        marginBottom: '14px',
                        display: 'flex',
                        flexDirection: "column"


                    }}>
                        <div
                            style={{
                                color: '#4D5060',
                                fontSize: '16px',
                                fontWeight: 500,
                                marginBottom: '10px',
                            }}
                        >
                            Name
                        </div>
                        <div
                            style={{
                                color: '#000000',
                                fontSize: '18px',
                                fontWeight: 700,
                            }}
                        >
                            {name || ""}
                        </div>
                    </div>
                    <div style={{
                        marginBottom: '14px',
                        display: 'flex',
                        flexDirection: "column"

                    }}>
                        <div
                            style={{
                                color: '#4D5060',
                                fontSize: '16px',
                                fontWeight: 500,
                                marginBottom: '10px',
                            }}
                        >
                            Grant Date
                        </div>
                        <div
                            style={{
                                color: '#000000',
                                fontSize: '18px',
                                fontWeight: 700,
                            }}
                        >
                            {grantdate|| "-"}
                        </div>
                    </div>
                    <div style={{
                        marginBottom: '14px',
                        display: 'flex',
                        flexDirection: "column"


                    }}>
                        <div
                            style={{
                                color: '#4D5060',
                                fontSize: '16px',
                                fontWeight: 500,
                                marginBottom: '10px',
                            }}
                        >
                            Expiration Date
                        </div>
                        <div
                            style={{
                                color: '#000000',
                                fontSize: '18px',
                                fontWeight: 700,
                            }}
                        >
                            {expirationDate || "-"}

                        </div>
                    </div>

                </div>
            </div>
        ),
        { width: 1200, height: 530 }
    )
}

export default handle