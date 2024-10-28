import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
export const config={
  endpoint:"https://cloud.appwrite.io/v1",
  platform: 'com.krimson.aora',
  projectId:"671e87ad002ad3bcc9e0",
  databaseId:"671e88a300238dbcb501",
  userCollectionId:"671e88d2002f0189e6ab",
  videoCollectionId:"671e88f5003485807f08",
  storageId:"671e89d2002a74f037c8"
}
const{endpoint,platform,projectId,databaseId,userCollectionId,videoCollectionId,storageId

}=config;


const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    await account.deleteSession("current");
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

//Get Posts
export const getAllPosts =async()=>{
  try {
    const posts=await databases.listDocuments(
      databaseId,
      videoCollectionId
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
//Get latest posts
export const getLatestPosts =async()=>{
  try {
    const posts=await databases.listDocuments(
      databaseId,
      videoCollectionId,[Query.orderDesc('$createdAt',Query.limit(7))]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//Search posts
export const searchPosts =async(query)=>{
  try {
    const posts=await databases.listDocuments(
      databaseId,
      videoCollectionId,[Query.search(
        'title',query)]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Search for user's posts
export const getuserPosts =async(query)=>{
  try {
    const posts=await databases.listDocuments(
      databaseId,
      videoCollectionId,[Query.equal(
        'creator',userId)]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//Logout 
export const signOut=async()=>{
  try {
    const session=await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error)
  }
}