package com.shivamjaiswalapp.schoolapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class FrontPageActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_front_page);

        new android.os.Handler(Looper.getMainLooper()).postDelayed(
                new Runnable() {
                    public void run() {
                        checkUserLogin();
                    }
                },
                1000);
    }
    public void checkUserLogin(){
        mAuth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null){
            Intent intent = new Intent(FrontPageActivity.this,LoginActivity.class);
            startActivity(intent);
            overridePendingTransition(0,0);
        }
        else {
            Intent intent = new Intent(FrontPageActivity.this,NotificationsActivity.class);
            startActivity(intent);
            overridePendingTransition(0,0);
        }
    }
}