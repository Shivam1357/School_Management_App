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
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.FirebaseException;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthOptions;
import com.google.firebase.auth.PhoneAuthProvider;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class LoginActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        mAuth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        db = FirebaseFirestore.getInstance();

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
            Intent intent1 = new Intent(LoginActivity.this,NotificationsActivity.class);
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
                            saveUserDataAndOpenHome();

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
    public void saveUserDataAndOpenHome(){
        File folder = getExternalFilesDir("userData");
        String currentUserUid = FirebaseAuth.getInstance().getCurrentUser().getUid();
        db.collection("AllStudents")
                .whereEqualTo("userUid", currentUserUid)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                File file1 = new File(folder, "UserDetails_name.txt");
                                writeTextData(file1, document.getString("name"));

                                File file2 = new File(folder, "UserDetails_dob.txt");
                                writeTextData(file2, document.getString("dob"));

                                File file3 = new File(folder, "UserDetails_fatherName.txt");
                                writeTextData(file3, document.getString("fatherName"));

                                File file4 = new File(folder, "UserDetails_classCode.txt");
                                writeTextData(file4, document.getString("classCode"));

                                db.collection("AllClass")
                                        .document(document.getString("classCode"))
                                        .get()
                                        .addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                                            @Override
                                            public void onSuccess(@NonNull DocumentSnapshot documentSnapshot) {
                                                File file7 = new File(folder, "UserDetails_class.txt");
                                                writeTextData(file7, documentSnapshot.getString("class") + "-" + documentSnapshot.getString("section"));
                                            }
                                        });


                                File file5 = new File(folder, "UserDetails_admNo.txt");
                                writeTextData(file5, document.getString("admNo"));

                                File file6 = new File(folder, "UserDetails_session.txt");
                                writeTextData(file6, document.getString("session"));

                                Intent intent = new Intent(LoginActivity.this,NotificationsActivity.class);
                                startActivity(intent);
                                overridePendingTransition(0,0);
                            }
                        } else {
                            Toast.makeText(LoginActivity.this, "Some Error Occured", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
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