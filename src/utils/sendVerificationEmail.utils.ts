import Handlebars from "handlebars";
import mailTransporter from "@/configs/nodemailer.configs";
import mailOption from "./mailOption.utils";
import { verificationEmailTemplate } from "@/templates/verificationEmailTemplate";
import { IVerificationEmailData } from "@/interfaces/verificationEmailData.interfaces";

const sendVerificationEmail = async (data: IVerificationEmailData) => {
  try {
    const template = Handlebars.compile(verificationEmailTemplate);
    const personalizedTemplate = template(data);
    await mailTransporter.sendMail(
      mailOption(
        data.email,
        "Email Verification Required",
        personalizedTemplate
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default sendVerificationEmail;
