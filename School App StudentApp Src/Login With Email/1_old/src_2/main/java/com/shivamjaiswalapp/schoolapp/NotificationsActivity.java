package com.shivamjaiswalapp.schoolapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;
import android.widget.Toolbar;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.android.material.navigation.NavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.io.File;
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

        db.collection("Notifications").document("Students").collection("121")
                .orderBy("time", Query.Direction.DESCENDING)
                .addSnapshotListener(new EventListener<QuerySnapshot>() {
                    @Override
                    public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                        if (value != null ){
                            LinearLayout notificationHolder = (LinearLayout) findViewById(R.id.all_notifications);
                            notificationHolder.removeViews(1, notificationHolder.getChildCount() - 1);
                            for(DocumentSnapshot document : value.getDocuments()){
                                long time = document.getLong("time");
                                DateFormat simple = new SimpleDateFormat("dd MMM yyyy HH:mm:ss:SSS Z");
                                String timeFinal = getConvertedTime(time);

                                String message = document.getString("message");
                                createNotification(timeFinal + " - " + message);
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


    private void createNotification(String message){
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
        btn.setBackgroundResource(R.drawable.notfication_item_background);
        btn.setText(text);
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
}