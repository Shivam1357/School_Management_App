package com.shivamjaiswalapp.schoolapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.FirebaseException;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthOptions;
import com.google.firebase.auth.PhoneAuthProvider;

import java.util.concurrent.TimeUnit;

public class LoginActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        mAuth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();

        if (currentUser == null){
            Intent intent = getIntent();
            Uri data = intent.getData();

            TextInputEditText emailInput = findViewById(R.id.emailInput);
            TextInputEditText passwordInput = findViewById(R.id.passInput);

            try{
                String adm = data.getQueryParameter("adm");
                String password = data.getQueryParameter("pass");

                String email = adm + "@lfs.com";

                if (adm != null && password != null){
                    emailInput.setText(adm);
                    passwordInput.setText(password);
                    new android.os.Handler(Looper.getMainLooper()).postDelayed(
                            new Runnable() {
                                public void run() {
                                    SignInUser(email,password);
                                }
                            },
                            1000);
                }
            }
            catch (Exception e){}
        }
        else {
            Toast.makeText(this, "You are Logged In!", Toast.LENGTH_SHORT).show();
            Intent intent1 = new Intent(LoginActivity.this,HomePageActivity.class);
            startActivity(intent1);
            overridePendingTransition(0,0);
        }




    }
    @Override
    public void onBackPressed() {
        finishAffinity();
        super.onBackPressed();
    }
    public void LoginClicked(View view) {
        mAuth = FirebaseAuth.getInstance();
        TextInputEditText emailInput = findViewById(R.id.emailInput);
        String email1 = emailInput.getText().toString();

        String email = email1 + "@lfs.com";

        TextInputEditText passwordInput = findViewById(R.id.passInput);
        String password = passwordInput.getText().toString();

//        CheckBox teacherLoginChkBox = findViewById(R.id.teacherLoginCheckBox);
//        boolean isTeacherLogin = teacherLoginChkBox.isChecked();

        Button loginButton = findViewById(R.id.loginButton);
        ProgressBar progressBar = findViewById(R.id.progressCircular);

        if (email.length() > 0 && password.length() > 1  ){
            SignInUser(email,password);
        }
        else{
            new AlertDialog.Builder(this)
                    .setTitle("Error")
                    .setMessage("Fill all Credentials")

                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                        }
                    })
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .show();
        }
    }
    private void SignInUser(String email,String password){
        Button loginButton = findViewById(R.id.loginButton);
        ProgressBar progressBar = findViewById(R.id.progressCircular);
        TextInputEditText emailInput = findViewById(R.id.emailInput);
        TextInputEditText passwordInput = findViewById(R.id.passInput);

        emailInput.setEnabled(false);
        passwordInput.setEnabled(false);

        loginButton.setVisibility(View.GONE);
        progressBar.setVisibility(View.VISIBLE);

        mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            FirebaseUser user = mAuth.getCurrentUser();
                            Toast.makeText(LoginActivity.this, "Successfully Logged In", Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(LoginActivity.this,HomePageActivity.class);
                            startActivity(intent);
                            overridePendingTransition(0,0);
                        } else {
                            // If sign in fails, display a message to the user.
                            loginButton.setVisibility(View.VISIBLE);
                            progressBar.setVisibility(View.GONE);
                            emailInput.setEnabled(true);
                            passwordInput.setEnabled(true);
                            new AlertDialog.Builder(LoginActivity.this)
                                    .setTitle("Error")
                                    .setMessage("Wrong Password")
                                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                        public void onClick(DialogInterface dialog, int which) {
                                        }
                                    })
                                    .setIcon(android.R.drawable.ic_dialog_alert)
                                    .show();
                        }
                    }
                });
    }

}