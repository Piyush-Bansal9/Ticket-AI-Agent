import { NonRetriableError } from "inngest";
import User from "../../models/user.js"
import { inngest } from "../client.js";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    {id : "on-user-signup", retries: 2},
    {event: "user/signup"},
    async({event, step}) => {
        try {
            const {email} = event.data;
            const user = await step.run("get-user-email", async() => {
                const foundData = await User.findOne({email})
                if(!foundData) {
                    throw new NonRetriableError("No such user in database.");
                }
                return foundData;
            })

            await step.run("send-welcome-email", async() => {
                const subject = `Welcome to the app`
                const message = `Hii,
                \n \n Thanks for signing up. We are glad to have you onboard.`

                await sendMail(user.email, subject, message);
                return {success: true};
            })
        } catch(e) {
            console.error("Error running step: ", e);
            return {success: false};
        }
    }
)