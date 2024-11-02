package com.shivamjaiswalapp.schoolapp;

import android.app.PendingIntent;
import android.app.Service;
import android.content.*;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.*;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class NewNotificationCheck extends Service {

    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    public Context context = this;
    public Handler handler = null;
    public static Runnable runnable = null;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        Toast.makeText(this, "Service created!", Toast.LENGTH_LONG).show();
        db = FirebaseFirestore.getInstance();
        File folder = getExternalFilesDir("userData");
        File file = new File(folder, "notificationLastUpdate.txt");
        long time = Long.parseLong(getdata(file));


        db.collection("Notifications").document("Students").collection("121")
                .whereGreaterThan("time",time)
                .addSnapshotListener(new EventListener<QuerySnapshot>() {
                    @Override
                    public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                        Toast.makeText(context, "Su12", Toast.LENGTH_SHORT).show();
                        if (value != null ){
                            for(DocumentSnapshot document : value.getDocuments()){
                                String time = getConvertedTime(document.getLong("time"));
                                String message = document.getString("message");
                                Long id1 = document.getLong("id");
                                int id = Integer.parseInt(String.valueOf(id1));
//                                Toast.makeText(NewNotificationCheck.this, message, Toast.LENGTH_SHORT).show();
//
//                                int id = new Random().nextInt(100000);
                                NewMessageCreateNotification(time,message,id);
                            }
                            File folder = getExternalFilesDir("userData");
                            File file = new File(folder, "notificationLastUpdate.txt");
                            writeTextData(file, String.valueOf(System.currentTimeMillis()));
                        }
                    }
                });


//        handler = new Handler();
//        runnable = new Runnable() {
//            public void run() {
//                boolean connected = false;
//                ConnectivityManager connectivityManager = (ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE);
//                if(connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_MOBILE).getState() == NetworkInfo.State.CONNECTED ||
//                        connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI).getState() == NetworkInfo.State.CONNECTED) {
//                    //we are connected to a network
//                    connected = true;
//                    File folder = getExternalFilesDir("userData");
//                    File file = new File(folder, "notificationLastUpdate.txt");
//                    String time = getdata(file);
//                    CheckForNewMessages(time);
//                }
//                else{
//                    connected = false;
//                }
//                //Toast.makeText(context,String.valueOf(connected), Toast.LENGTH_SHORT).show();
//                handler.postDelayed(runnable, 30000);
//            }
//        };
//        handler.postDelayed(runnable,30000);
    }
//    private void CheckForNewMessages(String time){
//        //Toast.makeText(this, "Checking", Toast.LENGTH_SHORT).show();
//        long t1 = Long.parseLong(time);
//
//        db.collection("Notifications").document("Students").collection("121")
//                .whereGreaterThan("time",t1)
//                .get()
//                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
//                    @Override
//                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
//                        if (task.isSuccessful()) {
//                            //Toast.makeText(context, "Success", Toast.LENGTH_SHORT).show();
//                            for (QueryDocumentSnapshot document : task.getResult()) {
//                                //Toast.makeText(context, "Got a value qbcs", Toast.LENGTH_SHORT).show();
//                                String time = getConvertedTime(document.getLong("time"));
//                                String message = document.getString("message");
//
//
//                                int id = new Random().nextInt(100000);
//                                NewMessageCreateNotification(time,message,id);
//                            }
//                        } else {
//                            Toast.makeText(context, "Some Error Occured", Toast.LENGTH_SHORT).show();
//                        }
//                    }
//                });
//        File folder = getExternalFilesDir("userData");
//        File file = new File(folder, "notificationLastUpdate.txt");
//        writeTextData(file, String.valueOf(System.currentTimeMillis()));
//    }

    private void NewMessageCreateNotification(String time,String msg,int id) {
        Intent intent = new Intent(this, NotificationsActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this,"RN1234")
                .setSmallIcon(R.drawable.ic_baseline_school_24)
                .setContentTitle(time)
                .setContentText(msg)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);
        notificationManagerCompat.notify(id,builder.build());
    }
    private String getConvertedTime(long time){
        //DateFormat simple = new SimpleDateFormat("dd MMM yyyy HH:mm:ss:SSS Z");
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



    @Override
    public void onDestroy() {
        /* IF YOU WANT THIS SERVICE KILLED WITH THE APP THEN UNCOMMENT THE FOLLOWING LINE */
        //handler.removeCallbacks(runnable);
        Toast.makeText(this, "Service stopped", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onStart(Intent intent, int startid) {
        Toast.makeText(this, "Service started by user.", Toast.LENGTH_LONG).show();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
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

}