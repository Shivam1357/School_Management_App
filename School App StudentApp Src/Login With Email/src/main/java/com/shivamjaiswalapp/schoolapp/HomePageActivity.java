package com.shivamjaiswalapp.schoolapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.squareup.picasso.Picasso;

import org.w3c.dom.Text;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class HomePageActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;
    private FirebaseStorage storage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        db = FirebaseFirestore.getInstance();

//        BottomNavigationView bottomNavigationView = findViewById(R.id.home_navigation_bottom_view);
//        bottomNavigationView.setSelectedItemId(R.id.home);
//        bottomNavigationView.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
//            @Override
//            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
//                switch (item.getItemId()) {
//                    case R.id.home:
//                        item.setChecked(true);
//                        break;
//                    case R.id.notification:
//                        Intent intent = new Intent(HomePageActivity.this,NotificationsActivity.class);
//                        startActivity(intent);
//                        overridePendingTransition(0,0);
//                        break;
//                    case R.id.more_option:
//                        Intent intent2 = new Intent(HomePageActivity.this,MenuPageActivity.class);
//                        startActivity(intent2);
//                        overridePendingTransition(0,0);
//                        break;
//                }
//                return true;
//            }
//        });
        File folder = getExternalFilesDir("userData");
        File file = new File(folder, "notificationLastUpdate.txt");
        writeTextData(file, String.valueOf(System.currentTimeMillis()));

        TextView f = findViewById(R.id.textTest);
        ImageView img = findViewById(R.id.imageDisplay);

        storage = FirebaseStorage.getInstance();
        StorageReference storageReference = storage.getReference();

        ImageView i1 = findViewById(R.id.imageShow);

        storageReference.child("/NotificationFiles/1000/121.jpg").getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
            @Override
            public void onSuccess(@NonNull Uri uri) {
                Picasso.get().load(uri).into(i1);

                Picasso.get().load(uri).into(img);
                String c = String.valueOf(i1);

                f.setText(c);
            }
        });



    }

    public void OpenFull(View view) {
        RelativeLayout relativeLayout = findViewById(R.id.imageShowView);
        relativeLayout.setVisibility(View.VISIBLE);
    }



    @Override
    public void onBackPressed() {
        RelativeLayout relativeLayout = findViewById(R.id.imageShowView);

        if (relativeLayout.getVisibility() == View.VISIBLE){
            relativeLayout.setVisibility(View.GONE);
        }
        else{
//            finishAffinity();
            super.onBackPressed();
        }
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