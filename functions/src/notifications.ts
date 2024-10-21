/*
 * Sends an email using Firestore's mail collection.
 */
import axios from "axios";
import {TEXTIT_API_URL, TEXTIT_AUTH} from "./constant";
import {db} from "./index";

export const sendEmail = async (
    to: string, templateName: string, templateData: object, from?: string
) => {
    from ?
        await db.collection("mail").add({
            to,
            from,
            template: {
                name: templateName,
                data: templateData,
            },
        }) :
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
    await axios.post(
        TEXTIT_API_URL,
        {
            to,
            text,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": TEXTIT_AUTH,
            },
        }
    );
};
