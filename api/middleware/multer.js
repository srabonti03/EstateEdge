import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// post upload config
const postsDir = path.join(__dirname, "..", "..", "public", "posts");

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, postsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadImages = multer({ storage: storage }).array("images", 4);

export default uploadImages;

// User avatar upload config
const usersDir = path.join(__dirname, "..", "..", "public", "users");

if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, usersDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const uploadAvatar = multer({ storage: avatarStorage }).single("avatar");

// Agent avatar upload config
const agentsDir = path.join(__dirname, "..", "..", "public", "agents");

if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir, { recursive: true });
}

const agentAvatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, agentsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const uploadAgentAvatar = multer({ storage: agentAvatarStorage }).single("avatar");


// Admin avatar upload config
const adminsDir = path.join(__dirname, "..", "..", "public", "admins");

if (!fs.existsSync(adminsDir)) {
  fs.mkdirSync(adminsDir, { recursive: true });
}

const adminAvatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, adminsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const uploadAdminAvatar = multer({ storage: adminAvatarStorage }).single("avatar");

