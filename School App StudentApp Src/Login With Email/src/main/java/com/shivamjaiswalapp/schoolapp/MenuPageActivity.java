package com.shivamjaiswalapp.schoolapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import android.app.PendingIntent;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.android.material.navigation.NavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.firestore.Source;

import org.w3c.dom.Text;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MenuPageActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu_page);
        db = FirebaseFirestore.getInstance();

        BottomNavigationView bottomNavigationView = findViewById(R.id.home_navigation_bottom_view);
        bottomNavigationView.setSelectedItemId(R.id.more_option);
        bottomNavigationView.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.home:
                        Intent intent2 = new Intent(MenuPageActivity.this,HomePageActivity.class);
                        startActivity(intent2);
                        overridePendingTransition(0,0);
                        break;
                    case R.id.notification:
                        Intent intent = new Intent(MenuPageActivity.this,NotificationsActivity.class);
                        startActivity(intent);
                        overridePendingTransition(0,0);
                        break;
                    case R.id.more_option:
                        break;
                }
                return true;
            }
        });

        NavigationView navigationView = findViewById(R.id.side_nav_view);
        navigationView.getMenu().findItem(R.id.none).setVisible(false);
        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                switch (item.getItemId()){
                    case R.id.home:
                        Intent intent = new Intent(MenuPageActivity.this,HomePageActivity.class);
                        startActivity(intent);
                        overridePendingTransition(0,0);
                        break;
                    case R.id.notification:
                        Intent intent2 = new Intent(MenuPageActivity.this,NotificationsActivity.class);
                        startActivity(intent2);
                        overridePendingTransition(0,0);
                        break;
                    case R.id.userDetails:
                        OpenUserDetailsCard();
                        break;
                    case R.id.about:
                        AboutTheAppClicked();
                        break;
                    case R.id.logout:
                        LogoutClicked();
                        break;
                }
                return true;
            }
        });

        String greeting = "Welcome ";
        TextView studentName = findViewById(R.id.studentName);

        String currentUserUid = FirebaseAuth.getInstance().getCurrentUser().getUid();


        File folder = getExternalFilesDir("userData");
        File file = new File(folder, "UserDetails_name.txt");
        String name = getdata(file);
        studentName.setText(greeting + name);
    }

    private void AboutTheAppClicked() {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
        alertDialogBuilder.setTitle("About the App");
        alertDialogBuilder.setMessage("App Designed and Developed by Shivam Jaiswal\nVersion:1.0.0");
        alertDialogBuilder.setNegativeButton("Ok",new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
            }
        });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();

        new android.os.Handler(Looper.getMainLooper()).postDelayed(
                new Runnable() {
                    public void run() {
                        NavigationView navigationView = findViewById(R.id.side_nav_view);
                        navigationView.getMenu().findItem(R.id.none).setVisible(true);
                        navigationView.getMenu().findItem(R.id.none).setChecked(true);
                        navigationView.getMenu().findItem(R.id.none).setVisible(false);
                    }
                },
                3);
    }

    private void OpenUserDetailsCard() {
        File folder = getExternalFilesDir("userData");
        File admNo = new File(folder, "UserDetails_admNo.txt");
        File fName = new File(folder, "UserDetails_fatherName.txt");
        File className = new File(folder, "UserDetails_class.txt");
        File dob = new File(folder, "UserDetails_dob.txt");
        File name = new File(folder, "UserDetails_name.txt");

        TextView t1 = findViewById(R.id.admNo);
        t1.setText( "Admission No.:" + getdata(admNo));

        TextView t2 = findViewById(R.id.fName);
        t2.setText("Father's Name:" + getdata(fName));

        TextView t3 = findViewById(R.id.className);
        t3.setText("Class:" + getdata(className));

        TextView t4 = findViewById(R.id.dob);
        t4.setText("Date of Birth:" + getdata(dob));

        TextView t5 = findViewById(R.id.name);
        t5.setText("Name:" + getdata(name));


        LinearLayout l = findViewById(R.id.userDetailsCard);
        l.setVisibility(View.VISIBLE);
        new android.os.Handler(Looper.getMainLooper()).postDelayed(
                new Runnable() {
                    public void run() {
                        NavigationView navigationView = findViewById(R.id.side_nav_view);
                        navigationView.getMenu().findItem(R.id.none).setVisible(true);
                        navigationView.getMenu().findItem(R.id.none).setChecked(true);
                        navigationView.getMenu().findItem(R.id.none).setVisible(false);
                    }
                },
                3);
    }

    public void hideMyDetailsCard(View view) {
        LinearLayout l = findViewById(R.id.userDetailsCard);
        l.setVisibility(View.GONE);
    }

    @Override
    public void onBackPressed() {
        finishAffinity();
        super.onBackPressed();
    }
    public void LogoutClicked(){
        mAuth = FirebaseAuth.getInstance();
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
        alertDialogBuilder.setMessage("Are you sure to Logout?");
        alertDialogBuilder.setPositiveButton("yes",
                new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface arg0, int arg1) {
                        FirebaseAuth.getInstance().signOut();
                        Toast.makeText(MenuPageActivity.this, "Successfully Logged Out", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(MenuPageActivity.this,LoginActivity.class);
                        startActivity(intent);
                    }
                });
        alertDialogBuilder.setNegativeButton("No",new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                NavigationView navigationView = findViewById(R.id.side_nav_view);
                navigationView.getMenu().findItem(R.id.none).setVisible(true);
                navigationView.getMenu().findItem(R.id.none).setChecked(true);
                navigationView.getMenu().findItem(R.id.none).setVisible(false);
            }
        });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
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