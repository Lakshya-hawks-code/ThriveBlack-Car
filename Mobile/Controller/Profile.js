import fs from 'fs';
import { getUserById, UpdateUserDetails } from "../../Model/AdminModel.js";
import { uploadProfile } from '../../Mobile/helper/UploadProfile.js';

export const Showprofile = async (req, res) => {
    try {
        let request = req.body;;
        let Data = await getUserById({ _id: request?.id });
        if (Data) {
            let userData = {
                name: Data?.name,
                phone: Data?.phone ? Data?.phone : "",
                profile_img: Data?.profile_img,
            };
            return res.json({ status: 200, data: userData });
        }
        else {
            return res.json({ status: 400, message: "Record not Found" });
        }

    } catch (error) {
        console.log(`Failed to get details: ${error}`);
        return res.json({ status: 500, message: "Failed to get details" });
    }
};

export const EditProfile = async (req, res) => {
    try {
        const request = req.body;
        let uploadPath = '/Mobile/'

        let user = await getUserById({ _id: request?.id });

        if (!user) {
            return res.json({ status: 400, message: 'User not found' });
        }

        let updateFields = {
            name: request?.name,
            phone: request?.phone ? request?.phone : "",
            profile_img: user?.profile_img ? user.profile_img : ""
        };

        if (request?.profile_img) {
            let result;
            try {
                result = await uploadProfile(uploadPath, request?.profile_img);
                updateFields.profile_img = result; // Update profile_img with the new image path
            } catch (uploadError) {
                console.log(`Failed to upload profile image: ${uploadError}`);
            }
        }

        let userUpdate = await UpdateUserDetails({ _id: request?.id }, updateFields);

        if (userUpdate) {
            return res.json({ status: 200, message: 'Successfully Updated' });
        } else {
            return res.json({ status: 400, message: 'Failed to Update' });
        }
    } catch (error) {
        console.error(`Failed to update profile: ${error}`);
        return res.json({ status: 500, message: 'Failed to update profile' });
    }
};


export default {
    Showprofile,
    EditProfile
}