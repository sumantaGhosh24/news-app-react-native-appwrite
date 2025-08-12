import {
  Account,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

import {
  APPWRITE_DATABASE_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_NEWS_COLLECTION_ID,
  APPWRITE_PLATFORM,
  APPWRITE_PROJECT_ID,
  APPWRITE_STORAGE_ID,
  APPWRITE_USER_COLLECTION_ID,
} from "./config";

export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  platform: APPWRITE_PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  storageId: APPWRITE_STORAGE_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  newsCollectionId: APPWRITE_NEWS_COLLECTION_ID,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// account
export const createUser = async (
  email: string,
  password: string,
  username: string,
  name: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: `https://cloud.appwrite.io/v1/avatars/initials?name=${username}&width=192&height=192&project=console`,
        name: name,
      }
    );

    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

// database
export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch {
    return null;
  }
};

interface CreateNewsParams {
  title: string;
  description: string;
  userId: string;
  thumbnail: any;
}

export const createNews = async (form: CreateNewsParams) => {
  try {
    const data = await uploadFile(form.thumbnail);

    const newNews = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      ID.unique(),
      {
        title: form.title,
        description: form.description,
        thumbnail: data?.fileUrl,
        creator: form.userId,
        thumbnailId: data?.fileId,
      }
    );

    return newNews;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllNews = async () => {
  try {
    const news = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId
    );

    return news.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getNews = async (id: string) => {
  try {
    const news = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      id
    );
    if (!news) throw Error;

    return news;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserNews = async (userId: string) => {
  try {
    const news = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      [Query.equal("creator", userId)]
    );

    return news.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const searchNews = async (query: string) => {
  try {
    const news = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      [Query.search("title", query)]
    );

    if (!news) throw new Error("Something went wrong.");

    return news.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getLatestNews = async () => {
  try {
    const news = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return news.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteNews = async (id: string, fileId: string) => {
  try {
    await deleteFile(fileId);

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      id
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

// storage
export const uploadFile = async (file: any) => {
  if (!file) return;

  const {mimeType, ...rest} = file;
  const asset = {type: mimeType, ...rest};

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    return {
      fileUrl: `https://fra.cloud.appwrite.io/v1/storage/buckets/${APPWRITE_STORAGE_ID}/files/${uploadedFile.$id}/view?project=${APPWRITE_PROJECT_ID}`,
      fileId: uploadedFile.$id,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return;
  } catch (error: any) {
    throw new Error(error);
  }
};
