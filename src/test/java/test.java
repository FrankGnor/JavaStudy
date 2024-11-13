import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class test {
    public static void main(String[] args) {
        String value = "[1B]";
        //正则匹配里面的题号
        String regEx1="[^0-9]";
        Pattern p1 = Pattern.compile(regEx1);
        Matcher m1 = p1.matcher(value);

        //正则匹配里面的答案
        String regEx2="[^A-Z]";
        Pattern p2 = Pattern.compile(regEx2);
        Matcher m2 = p2.matcher(value);
        System.out.println(m1.replaceAll("").trim() +"  "+ m2.replaceAll("").trim());
    }
}
