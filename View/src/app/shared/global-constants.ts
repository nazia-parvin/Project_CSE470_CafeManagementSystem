export class GlobalConstants {
    //Message
    public static genericError: string = "Something wnet wrong. Please try again later";

    public static unauthorized:string = "You are not authorized to access this page."

    //RegEx
    public static nameRegEx: string = "[a-zA-Z0-9 ]*";
    public static emailRegEx: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
    public static contact_numberRegEx: string = "^[e0-9]{10,10}$";

    //Variable
    public static error: string = 'error';
}