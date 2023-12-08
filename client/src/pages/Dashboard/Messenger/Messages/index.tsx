import React, { useState, useEffect, useRef }  from "react";
import { styled } from "@mui/system";
import MessagesHeader from "./Header";
// import DUMMY_MESSAGES from "./DUMMY_MESSAGES";
import Message from "./Message";
import { useAppSelector } from "../../../../store";
import { fetchDirectChatHistory, fetchGroupChatHistory } from "../../../../socket/socketConnection";
import { Message as MessageType } from "../../../../actions/types";
import DateSeparator from "./DateSeparator";
import { Typography } from "@mui/material";
import * as CryptoJS from "crypto-js";


const MainContainer = styled("div")({
    height: "calc(100% - 142px)",
    overflow: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});


const Messages = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const {chat, auth: {userDetails}} = useAppSelector((state) => state);
    const {salt, p} = useAppSelector((state) => state.config)
    const [key, setKey] = useState('')
    const { chosenChatDetails, messages, chosenGroupChatDetails } = chat;
    const powerMod = (base:any, exponent:any, modulus:any) => {
        let result = 1
        console.log("base:", base);
        console.log("ex",exponent);
        console.log("modu", modulus);
        base = base % modulus
        while (exponent > 0) {
            if (exponent % 2 === 1) {
                result = (result * base) % modulus
            }
            exponent = Math.floor(exponent / 2)
            base = (base * base) % modulus
        }
        //console.log("resoult : ",result);
        
        return result
    }
    const getKey = (chosenChatDetails : any) => {
        try {
            if (salt && p) {
                const userDetails: any = localStorage.getItem("currentUser");
                const privateKey = JSON.parse(userDetails).privateKey;
                const keyEncrypted = powerMod(chosenChatDetails?.publicKey, privateKey, p)
                const saltedMessage : string = salt.toString() + keyEncrypted.toString()
                const hash :any = CryptoJS.SHA256(saltedMessage)
                setKey(hash)
            }
        } catch (error) {
            console.log(error);
            
        }
        
    }
    const sameAuthor = (message: MessageType, index: number) => {

        if (index === 0) {
            return false;
        }
        return message.author._id === messages[index - 1].author._id;
    }

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef?.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        setScrollPosition(e.currentTarget.scrollTop);
    };
    
    useEffect(() => {
        const fetchChatHistory = async() => {
            try {
                if (chosenChatDetails) {
                    getKey(chosenChatDetails)
                    fetchDirectChatHistory({
                        receiverUserId: chosenChatDetails.userId,
                    });
                }
        
                if(chosenGroupChatDetails) {
                    fetchGroupChatHistory({
                        groupChatId: chosenGroupChatDetails.groupId
                    })
                }
            } catch (error) {
                console.log(error);
            }
        } 
        fetchChatHistory()
    }, [chosenChatDetails, chosenGroupChatDetails]);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <MainContainer onScroll={handleScroll}>
            <MessagesHeader scrollPosition={scrollPosition} />

            <Typography
                sx={{
                    color: "#b9bbbe",
                    marginTop: "15px",
                    fontSize: "13px",
                }}
            >
                {chat.chosenChatDetails?.userId
                    ? `This is the beginning of your conversation with ${chat.chosenChatDetails?.username}`
                    : "This is the beginning of the conversation with your friends!"}
            </Typography>

            {messages.map((message, index) => {
                const thisMessageDate = new Date(
                    message.createdAt
                ).toDateString();
                const prevMessageDate =
                    index > 0 &&
                    new Date(messages[index - 1]?.createdAt).toDateString();

                const isSameDay =
                    index > 0 ? thisMessageDate === prevMessageDate : true;

                const incomingMessage =
                    message.author._id !== (userDetails as any)._id;
                const type = message.type
                return (
                    <div key={message._id} style={{ width: "97%" }}>
                        {(!isSameDay || index === 0) && (
                            <DateSeparator date={message.createdAt} />
                        )}

                        <Message
                            content={ type === "DIRECT" ? (() => {
                                try {
                                  const decryptedContent = CryptoJS.AES.decrypt(
                                    message.content,
                                    `${key}`
                                  ).toString(CryptoJS.enc.Utf8);
                                  return decryptedContent;
                                } catch (error) {
                                  return "";
                                }
                              })() : message.content}
                            username={message.author.username}
                            sameAuthor={sameAuthor(message, index)}
                            date={message.createdAt}
                            incomingMessage={incomingMessage}
                        />
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </MainContainer>
    );
};

export default Messages;
