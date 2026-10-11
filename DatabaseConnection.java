import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {

    static String url = "jdbc:oracle:thin:@localhost:1521:XE";

    static String username = "system";

    static String password = "Subha1234";

    public static Connection getConnection() throws Exception {

        Class.forName("oracle.jdbc.OracleDriver");

        return DriverManager.getConnection(
                url,
                username,
                password
        );
    }

    public static void main(String[] args) {

        try {

            Connection con = getConnection();

            System.out.println(
                    "Connected to Oracle Database successfully!"
            );

            con.close();

        } catch (Exception e) {

            System.out.println("Connection failed!");

            e.printStackTrace();
        }
    }
}