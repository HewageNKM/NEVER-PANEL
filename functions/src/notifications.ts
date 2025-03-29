/*
 * Sends an email using Firestore's mail collection.
 */
import axios from "axios";
import {db} from "./index";
import {TEXT_API_KEY} from "./constant";
import {firestore} from "firebase-admin";

export const sendEmail = async (
    to: string, templateName: string, templateData: object
) => {
    console.log("Sending email to: ", to);
    console.log("Template: ", templateName);
    console.log("Data: ", templateData);
    await db.collection("mail").add({
        to,
        template: {
            name: templateName,
            data: templateData,
        },
    });
};

/*
 * Sends an SMS using TextIt API.
 */
export const sendSMS = async (to: string, text: string) => {
    try {
        const data = JSON.stringify({
            to: to,
            text: text,
        });
        console.log("Sending SMS to: ", to);
        console.log("Text: ", text);
        await axios(
            {
                method: 'POST',
                url: "https://api.textit.biz/",
                data: data,
                headers: {
                    Authorization: `Basic ${TEXT_API_KEY}`,
                    'Content-Type': 'application/json',
                    "Accept": "*/*"
                }
            }
    )
        const id = `SM-${crypto.randomUUID().replace("-", "").substring(0, 5)}`.toLowerCase();
        await db.collection("sms").doc(id).set({
            id,
            to,
            text,
            sentAt: firestore.Timestamp.now(),
        })
    } catch (e) {
        console.log("Failed to send SMS: ", e)
    }
};
