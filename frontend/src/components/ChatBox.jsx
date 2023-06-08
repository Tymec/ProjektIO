import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Card, Form } from "react-bootstrap";

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const chatBoxRef = useRef(null);

    const toggleChatBox = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    // wrap handleFormSubmit in useCallback to prevent infinite loop
    const handleFormSubmit = useCallback(async (event) => {
        event.preventDefault();
        if (message.trim()) {
            setChatHistory((prevChatHistory) => [
                ...prevChatHistory,
                { text: message, sender: "User" },
            ]);
            setMessage("");

            // Send the message to the GPT-3 API
            try {
                fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
                    },
                })
                .then(async res => setChatHistory((prevChatHistory) => [
                    ...prevChatHistory,
                    { text: res.json().data.choices[0].text, sender: "Bot" },
                ]))
            } catch (error) {
                console.error("There was an error in making the request: ", error);
            }
        }
    }, [message]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Enter" && message.trim()) {
                event.preventDefault();
                handleFormSubmit(event);
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [message, handleFormSubmit]);

    return (
        <>
            {isOpen && (
                <Card
                    className="shadow"
                    style={{
                        width: "300px",
                        position: "fixed",
                        right: "23px",
                        bottom: "20px",
                        zIndex: 9999,
                        borderRadius: "5px",
                    }}
                    ref={chatBoxRef}
                >
                    <Card.Header>
                        <Button
                            variant="link"
                            size="sm"
                            className="position-absolute top-0 start-0"
                            style={{ left: 0, top: 0, padding: "0.3rem" }}
                            onClick={toggleChatBox}
                        >
                            X
                        </Button>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: "400px", overflowY: "scroll" }}>
                        {chatHistory.map((msg, idx) => (
                            <p key={idx}>
                                <b>{msg.sender}:</b> {msg.text}
                            </p>
                        ))}
                    </Card.Body>
                    <Form onSubmit={handleFormSubmit} className="d-flex flex-column">
                        <Form.Group className="m-2">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={message}
                                onChange={handleInputChange}
                                style={{ resize: "none" }}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" className="m-2" style={{ width: '300px' }}>
                                Send
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}
            <Button
                variant="primary"
                onClick={toggleChatBox}
                className={`mt-3 ${isOpen ? "d-none" : ""}`}
                style={{
                    transform: "rotate(-90deg)",
                    position: "fixed",
                    right: "23px",
                    top: "30%",
                    transformOrigin: "right center",
                    zIndex: 9999,
                }}
            >
                Open chat
            </Button>
        </>
    );
};

export default ChatBox;
