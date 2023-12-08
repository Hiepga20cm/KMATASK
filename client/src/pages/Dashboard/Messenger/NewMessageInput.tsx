import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { useAppSelector } from "../../../store";
import { notifyTyping, sendDirectMessage, sendGroupMessage } from "../../../socket/socketConnection";
import * as CryptoJS from "crypto-js";
const MainContainer = styled("div")({
    height: "60px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

const Input = styled("input")({
    backgroundColor: "#2f3136",
    width: "98%",
    height: "44px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    padding: "0 10px",
});

const NewMessageInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const [focused, setFocused] = useState(false);

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    const { chosenChatDetails, chosenGroupChatDetails } = useAppSelector((state) => state.chat);
    const {salt, p} = useAppSelector((state) => state.config)
    const powerMod = (base:any, exponent:any, modulus:any) => {
        let result = 1
        base = base % modulus
        while (exponent > 0) {
            if (exponent % 2 === 1) {
                result = (result * base) % modulus
            }
            exponent = Math.floor(exponent / 2)
            base = (base * base) % modulus
        }
        return result
    }

    const handleSendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        try {
        if (e.key === "Enter") {
            
            if(chosenChatDetails) {
                const userDetails: any = localStorage.getItem("currentUser");
                if (userDetails) {
                  const privateKey = JSON.parse(userDetails).privateKey;
                  const keyEncrypted = powerMod(chosenChatDetails.publicKey, privateKey, p)
                  const saltedMessage = salt.toString() + keyEncrypted.toString()
                  const hash = CryptoJS.SHA256(saltedMessage)
                  const encryptedMessage:string = CryptoJS.AES.encrypt(
                    message,
                    `${hash}`
                ).toString()
                  sendDirectMessage({
                      message:encryptedMessage,
                      receiverUserId: chosenChatDetails.userId!,
                  });
                }
            }
            
            if(chosenGroupChatDetails) {
                sendGroupMessage({
                    message,
                    groupChatId: chosenGroupChatDetails.groupId
                })
            }


            setMessage("");
        }
    } catch (error) {
           console.log(error);
            
    }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    };


    useEffect(() => {
        // notify the receiverUser that the user(sender) is typing
        if (chosenChatDetails?.userId) {
            notifyTyping({
                receiverUserId: chosenChatDetails.userId!,
                typing: focused,
            });
        }
    }, [focused, chosenChatDetails?.userId]);

    return (
        <MainContainer>
            <Input
                placeholder={chosenChatDetails  ? `Write message to ${chosenChatDetails.username}` : "Your message..."}
                value={message}
                onChange={handleChange}
                onKeyDown={handleSendMessage}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </MainContainer>
    );
};

export default NewMessageInput;
