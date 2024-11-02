package com.shivamjaiswalapp.schoolapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.mlkit.common.model.DownloadConditions;
import com.google.mlkit.nl.translate.TranslateLanguage;
import com.google.mlkit.nl.translate.Translation;
import com.google.mlkit.nl.translate.Translator;
import com.google.mlkit.nl.translate.TranslatorOptions;

import org.w3c.dom.Text;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class NotificationsActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notifications);
        db = FirebaseFirestore.getInstance();
        createNotificationChannel();

        File folder = getExternalFilesDir("userData");
        File file = new File(folder, "notificationLastUpdate.txt");
        writeTextData(file, String.valueOf(System.currentTimeMillis()));



        startService(new Intent(this, NewNotificationCheck.class));
        SwipeRefreshLayout swipeRefreshLayout = findViewById(R.id.notificationsRefresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                getAllMessages();
            }
        });

        BottomNavigationView bottomNavigationView = findViewById(R.id.home_navigation_bottom_view);
        bottomNavigationView.setSelectedItemId(R.id.notification);
        bottomNavigationView.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.home:
                        Intent intent = new Intent(NotificationsActivity.this, HomePageActivity.class);
                        startActivity(intent);
                        overridePendingTransition(0,0);
                        break;
                    case R.id.notification:
                        break;
                    case R.id.more_option:
                        Intent intent2 = new Intent(NotificationsActivity.this,MenuPageActivity.class);
                        startActivity(intent2);
                        overridePendingTransition(0,0);
                        break;
                }
                return true;
            }
        });
        getAllMessages();
    }

    @Override
    protected void onDestroy() {
        startService(new Intent(this, NewNotificationCheck.class));
        super.onDestroy();
    }

    private void getAllMessages(){
        LinearLayout notificationHolder = (LinearLayout) findViewById(R.id.all_notifications);
        notificationHolder.removeViews(1, notificationHolder.getChildCount() - 1);

        SwipeRefreshLayout swipeRefreshLayout = findViewById(R.id.notificationsRefresh);
        swipeRefreshLayout.setRefreshing(false);

        File folder = getExternalFilesDir("userData");
        File file2 = new File(folder, "notificationTabLastOpen.txt");
        long notificationTabLastOpen = 0;
        try{
            notificationTabLastOpen = Long.parseLong(getdata(file2));
        }
        catch (Exception e){
        }




        writeTextData(file2, String.valueOf(System.currentTimeMillis()));

        File file = new File(folder, "UserDetails_classCode.txt");
        String classCode = getdata(file);


        long finalNotificationTabLastOpen = notificationTabLastOpen;
        db.collection("Notifications").document("Students").collection(classCode)
                .orderBy("timeSent", Query.Direction.DESCENDING)
                .addSnapshotListener(new EventListener<QuerySnapshot>() {
                    @Override
                    public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                        if (value != null ){
                            LinearLayout notificationHolder = (LinearLayout) findViewById(R.id.all_notifications);
                            notificationHolder.removeViews(1, notificationHolder.getChildCount() - 1);
                            for(DocumentSnapshot document : value.getDocuments()){
                                long time = document.getLong("timeSent");
                                String timeFinal = getConvertedTime(time);
                                String sender = document.getString("sender");
                                String message = document.getString("message");
                                if (time< finalNotificationTabLastOpen){
                                    createNotification(timeFinal + " - " + message + "\n" + "From:" + sender,true);
                                }
                                else{
                                    createNotification(timeFinal + " - " + message + "\n" + "From:" + sender,false);
                                }
                            }
                        }
                        if(error != null){
                            Toast.makeText(NotificationsActivity.this, "Some error Occured", Toast.LENGTH_SHORT).show();
                        }

                    }
                });



//        db.collection("Notifications").document("Students").collection("121")
//                .orderBy("time", Query.Direction.DESCENDING)
//                .get()
//                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
//                    @Override
//                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
//                        if (task.isSuccessful()) {
//                            //Toast.makeText(context, "Success", Toast.LENGTH_SHORT).show();
//                            for (QueryDocumentSnapshot document : task.getResult()) {
//                                long time = document.getLong("time");
//                                //DateFormat simple = new SimpleDateFormat("dd MMM yyyy HH:mm:ss:SSS Z");
//                                String timeFinal = getConvertedTime(time);
//
//                                String message = document.getString("message");
//                                createNotification(timeFinal + " - " + message);
//                            }
//                        } else {
//                            Toast.makeText(NotificationsActivity.this, "Some Error Occured", Toast.LENGTH_SHORT).show();
//                        }
//                    }
//                });
    }
    private String getConvertedTime(long time){
        DateFormat simple1 = new SimpleDateFormat("dd MMM yyyy");
        Date result1 = new Date(time);
        String convertTime1 = simple1.format(result1);

        DateFormat simple2 = new SimpleDateFormat("HH");
        Date result2 = new Date(time);
        int convertTime2 = Integer.valueOf(simple2.format(result2));
        String timeFinal;
        if (convertTime2 < 13 ){
            DateFormat simple3 = new SimpleDateFormat("mm");
            Date result3 = new Date(time);
            String convertTime3 = simple3.format(result3);

            timeFinal = convertTime1 + " " + String.valueOf(convertTime2) + ":" + convertTime3 + " AM";
        }
        else {
            DateFormat simple3 = new SimpleDateFormat("mm");
            Date result3 = new Date(time);
            String convertTime3 = simple3.format(result3);

            timeFinal = convertTime1 + " " + String.valueOf(convertTime2-12) + ":" + convertTime3 + " PM";
        }
        return timeFinal;
    }


    private void createNotification(String message,boolean read){
        ProgressBar p = findViewById(R.id.notificationsLoading);
        p.setVisibility(View.GONE);
        LinearLayout notificationHolder = (LinearLayout) findViewById(R.id.all_notifications);


        String text = message;
        Button btn = new Button(this);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );

        layoutParams.setMargins(getPXValue(5),getPXValue(10),getPXValue(5),0);
        btn.setLayoutParams(layoutParams);
        btn.setPadding(getPXValue(10),getPXValue(10),getPXValue(10),getPXValue(10));
        btn.setAllCaps(false);
        btn.setGravity(Gravity.LEFT);
        if (read == true){
            btn.setBackgroundResource(R.drawable.notification_item_background_read);
        }
        else {
            btn.setBackgroundResource(R.drawable.notification_item_background_unread);
        }

        btn.setText(text);
        btn.setTextSize(TypedValue.COMPLEX_UNIT_SP,14);
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Button b = (Button)v;
                ShowNotificationDialog(b.getText().toString());
                //ShowNotificationInAlertDialog(b.getText().toString());
            }
        });
        notificationHolder.addView(btn);
    }
    public int getPXValue(int dp){
        Resources r = this.getResources();
        int px = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                dp,
                r.getDisplayMetrics());
        return px;
    }
    private void ShowNotificationDialog(String msg){
        String time = msg.substring(0,msg.indexOf("-"));
        String messageMain = msg.substring(msg.indexOf("-")+2,msg.indexOf("From:")-1);
        String sender = msg.substring(msg.indexOf("From:"),msg.length());

        RelativeLayout r = findViewById(R.id.dialogShowRelativeLayout);

        //TextView dialogMessage = findViewById(R.id.dialogTextMessage);
        TextView dialogTime = findViewById(R.id.dialogTextTime);
        TextView dialogSender = findViewById(R.id.dialogTextSender);

        dialogTime.setText(time);
        dialogSender.setText(sender);

        int i = 1;
        while (i>0){
            if (messageMain.indexOf("http") == -1){
                LinearLayout messageLayout = findViewById(R.id.dialogAllMessages);
                TextView t1 = new TextView(this);
                LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );
                t1.setLayoutParams(layoutParams);
                t1.setTextSize(TypedValue.COMPLEX_UNIT_SP,17);

                t1.setText(messageMain);
                t1.setTextColor(ContextCompat.getColor(getApplicationContext(),R.color.black));
                messageLayout.addView(t1);
                i = 0;
            }
            else{
                if (messageMain.indexOf("http") == 0){
                    if (messageMain.indexOf(" ") == -1){
                        LinearLayout messageLayout = findViewById(R.id.dialogAllMessages);
                        //TextInputEditText t1 = new TextInputEditText(this);
                        TextView t1 = new TextView(this);
                        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.WRAP_CONTENT,
                                LinearLayout.LayoutParams.WRAP_CONTENT
                        );
                        t1.setLayoutParams(layoutParams);
                        t1.setTextSize(TypedValue.COMPLEX_UNIT_SP,17);
                        t1.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                TextView t = (TextView) t1;
                                OpenLinkClicked(t1.getText().toString());
                            }
                        });
                        t1.setText(messageMain);
                        t1.setTextColor(ContextCompat.getColor(getApplicationContext(),R.color.purple_500));
                        messageLayout.addView(t1);
                        i = 0;
                    }
                    else{
                        String m1 = messageMain.substring(0,messageMain.indexOf(" "));

                        LinearLayout messageLayout = findViewById(R.id.dialogAllMessages);
                        TextView t1 = new TextView(this);
                        //TextInputEditText t1 = new TextInputEditText(this);
                        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                                LinearLayout.LayoutParams.WRAP_CONTENT,
                                LinearLayout.LayoutParams.WRAP_CONTENT
                        );
                        t1.setLayoutParams(layoutParams);
                        t1.setTextSize(TypedValue.COMPLEX_UNIT_SP,17);
                        t1.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                TextView t = (TextView) t1;
                                OpenLinkClicked(t1.getText().toString());
                            }
                        });
                        t1.setText(m1);
                        t1.setTextColor(ContextCompat.getColor(getApplicationContext(),R.color.purple_500));
                        messageLayout.addView(t1);

                        messageMain = messageMain.substring(messageMain.indexOf(" ")+1,messageMain.length());
                    }
                }
                else{
                    LinearLayout messageLayout = findViewById(R.id.dialogAllMessages);
                    //TextInputEditText t1 = new TextInputEditText(this);
                    TextView t1 = new TextView(this);
                    LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                            LinearLayout.LayoutParams.WRAP_CONTENT,
                            LinearLayout.LayoutParams.WRAP_CONTENT
                    );
                    t1.setLayoutParams(layoutParams);
                    t1.setTextSize(TypedValue.COMPLEX_UNIT_SP,17);

                    String m1 = messageMain.substring(0,messageMain.indexOf("http"));

                    t1.setText(m1);
                    t1.setTextColor(ContextCompat.getColor(getApplicationContext(),R.color.black));
                    messageLayout.addView(t1);
                    messageMain = messageMain.substring(messageMain.indexOf("http"),messageMain.length());
                }

            }

        }
        r.setVisibility(View.VISIBLE);
    }

    private void OpenLinkClicked(String url) {
        Intent bIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        startActivity(bIntent);
    }


    private void TranslateText(){
        TranslatorOptions options =
                new TranslatorOptions.Builder()
                        .setSourceLanguage(TranslateLanguage.ENGLISH)
                        .setTargetLanguage(TranslateLanguage.HINDI)
                        .build();
        final Translator englishHindiTranslator =
                Translation.getClient(options);

        DownloadConditions conditions = new DownloadConditions.Builder()
                .build();

        Toast.makeText(this, "Downloading Translator....", Toast.LENGTH_SHORT).show();
        englishHindiTranslator.downloadModelIfNeeded(conditions)
                .addOnSuccessListener(
                        new OnSuccessListener<Void>() {
                            @Override
                            public void onSuccess(Void v) {
                                // Model downloaded successfully. Okay to start translating.
                                // (Set a flag, unhide the translation UI, etc.)
                                Toast.makeText(NotificationsActivity.this, "Translator Downloaded", Toast.LENGTH_SHORT).show();
                                ModelDownloadedTranslate();
                            }
                        })
                .addOnFailureListener(
                        new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                // Model couldn’t be downloaded or other internal error.
                                // ...
                                Toast.makeText(NotificationsActivity.this, "Error in Downloading Translator....", Toast.LENGTH_SHORT).show();
                            }
                        });
    }


    private void ModelDownloadedTranslate(){
        LinearLayout messageLayout = findViewById(R.id.dialogAllMessages);


        final int childCount = messageLayout.getChildCount();
        //Toast.makeText(this, String.valueOf(childCount), Toast.LENGTH_SHORT).show();
        for (int i = 0; childCount > i ; i++ ){
            View v = messageLayout.getChildAt(i);
            TextView dMessage = (TextView) v;

            TranslatorOptions options =
                    new TranslatorOptions.Builder()
                            .setSourceLanguage(TranslateLanguage.ENGLISH)
                            .setTargetLanguage(TranslateLanguage.HINDI)
                            .build();
            final Translator englishHindiTranslator =
                    Translation.getClient(options);

            englishHindiTranslator.translate(dMessage.getText().toString())
                    .addOnSuccessListener(
                            new OnSuccessListener<String>() {
                                @Override
                                public void onSuccess(@NonNull String translatedText) {
                                    dMessage.setText(translatedText);
//                                DisplayTranslatedText(m1 + translatedText + "\n" + m3);
                                }
                            })
                    .addOnFailureListener(
                            new OnFailureListener() {
                                @Override
                                public void onFailure(@NonNull Exception e) {
                                    Toast.makeText(NotificationsActivity.this, "Error in Translating or Downloading Translator", Toast.LENGTH_SHORT).show();
                                }
                            });

            if (i == 0){
                Button translateButton = findViewById(R.id.translateButton);
                translateButton.setVisibility(View.GONE);
            }
        }





    }


    @Override
    public void onBackPressed() {
        finishAffinity();
        super.onBackPressed();
    }
    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Notifications";
            String description = "Regular Notification";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("RN1234", name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
    public void TestNotification(View view) {
        // Create an explicit intent for an Activity in your app
        Intent intent = new Intent(this, NotificationsActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this,"RN1234")
                .setSmallIcon(R.drawable.ic_baseline_school_24)
                .setContentTitle("Test")
                .setContentText("Testing Success")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);
        notificationManagerCompat.notify(12,builder.build());
    }
    private void writeTextData(File file, String data) {
        FileOutputStream fileOutputStream = null;
        try {
            fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(data.getBytes());
            //Toast.makeText(this, "Done" + file.getAbsolutePath(), Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fileOutputStream != null) {
                try {
                    fileOutputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    private String getdata(File myfile) {
        FileInputStream fileInputStream = null;
        try {
            fileInputStream = new FileInputStream(myfile);
            int i = -1;
            StringBuffer buffer = new StringBuffer();
            while ((i = fileInputStream.read()) != -1) {
                buffer.append((char) i);
            }
            return buffer.toString();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fileInputStream != null) {
                try {
                    fileInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public void dialogBoxRemove(View view) {
        RelativeLayout relativeLayout = findViewById(R.id.dialogShowRelativeLayout);
        relativeLayout.setVisibility(View.GONE);

        Button translateButton = findViewById(R.id.translateButton);
        translateButton.setVisibility(View.VISIBLE);

        LinearLayout messageLayout = findViewById(R.id.dialogAllMessages);
        messageLayout.removeAllViews();
    }

    public void translateDialogBoxTextClicked(View view) {
        //Toast.makeText(this, "Translate", Toast.LENGTH_SHORT).show();
        TranslateText();
    }

    public void noEffect(View view) {
    }

    public void dialogMessageClicked(View view) {

    }
}