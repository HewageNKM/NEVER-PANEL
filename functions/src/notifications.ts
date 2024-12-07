/*
 * Sends an email using Firestore's mail collection.
 */
import axios from "axios";
import {db} from "./index";

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
                    Authorization: "Basic 20e5gkd160cdecea7dtd26cfadh8421",
                    'Content-Type': 'application/json',
                    "Accept": "*/*"
                }
            }
        )
    } catch (e) {
        console.log("Failed to send SMS: ", e)
    }
};
