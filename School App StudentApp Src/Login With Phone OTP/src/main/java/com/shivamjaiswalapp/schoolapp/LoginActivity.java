package com.shivamjaiswalapp.schoolapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.FirebaseException;
import com.google.firebase.FirebaseTooManyRequestsException;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthOptions;
import com.google.firebase.auth.PhoneAuthProvider;

import org.w3c.dom.Text;

import java.util.concurrent.TimeUnit;

public class LoginActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;

    private String mVerificationId;
    private PhoneAuthProvider.ForceResendingToken mResendToken;
    private PhoneAuthProvider.OnVerificationStateChangedCallbacks mCallbacks;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mCallbacks = new PhoneAuthProvider.OnVerificationStateChangedCallbacks() {

            @Override
            public void onVerificationCompleted(PhoneAuthCredential credential) {
                // This callback will be invoked in two situations:
                // 1 - Instant verification. In some cases the phone number can be instantly
                //     verified without needing to send or enter a verification code.
                // 2 - Auto-retrieval. On some devices Google Play services can automatically
                //     detect the incoming verification SMS and perform verification without
                //     user action.
                //Log.d(TAG, "onVerificationCompleted:" + credential);

                signInWithPhoneAuthCredential(credential);
            }

            @Override
            public void onVerificationFailed(FirebaseException e) {
                // This callback is invoked in an invalid request for verification is made,
                // for instance if the the phone number format is not valid.
                //Log.w(TAG, "onVerificationFailed", e);

                if (e instanceof FirebaseAuthInvalidCredentialsException) {
                    new AlertDialog.Builder(LoginActivity.this)
                            .setTitle("Error")
                            .setMessage("Invalid Phone Number")
                            .setPositiveButton("Close", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int which) {
                                }
                            })
                            .setIcon(android.R.drawable.ic_dialog_alert)
                            .show();
                    
                    ProgressBar p = findViewById(R.id.progressCircularSendOTP);
                    p.setVisibility(View.GONE);

                    Button b = findViewById(R.id.sendOtpButton);
                    b.setVisibility(View.VISIBLE);

                    // Invalid request
                } else if (e instanceof FirebaseTooManyRequestsException) {
                    // The SMS quota for the project has been exceeded
                    Toast.makeText(LoginActivity.this, "Some error Occured , Try Again later", Toast.LENGTH_LONG).show();
                    ProgressBar p = findViewById(R.id.progressCircularSendOTP);
                    p.setVisibility(View.GONE);

                    Button b = findViewById(R.id.sendOtpButton);
                    b.setVisibility(View.VISIBLE);
                }
                // Show a message and update the UI
            }

            @Override
            public void onCodeSent(@NonNull String verificationId,
                                   @NonNull PhoneAuthProvider.ForceResendingToken token) {
                // The SMS verification code has been sent to the provided phone number, we
                // now need to ask the user to enter the code and then construct a credential
                // by combining the code with a verification ID.
                //Log.d(TAG, "onCodeSent:" + verificationId);
                LinearLayout l = findViewById(R.id.sendOtpButtonLayout);
                l.setVisibility(View.GONE);

                TextInputEditText i1 = findViewById(R.id.mobileInput);
                i1.setEnabled(false);

                TextView t = findViewById(R.id.otpLabel);
                t.setVisibility(View.VISIBLE);

                TextInputEditText i = findViewById(R.id.otpInput);
                i.setVisibility(View.VISIBLE);

                LinearLayout l2 = findViewById(R.id.loginButtonLayout);
                l2.setVisibility(View.VISIBLE);

                Toast.makeText(LoginActivity.this, "Otp Sent", Toast.LENGTH_SHORT).show();

                // Save verification ID and resending token so we can use them later
                mVerificationId = verificationId;
                mResendToken = token;

                TextView v = findViewById(R.id.verificationId);
                v.setText(verificationId);
            }
        };
    }
    @Override
    public void onBackPressed() {
        finishAffinity();
        super.onBackPressed();
    }

    public void SendOtpClicked(View view) {
        mAuth = FirebaseAuth.getInstance();
        TextInputEditText mobileInput = findViewById(R.id.mobileInput);
        String phone = "+91" + mobileInput.getText().toString();

        ProgressBar p = findViewById(R.id.progressCircularSendOTP);
        p.setVisibility(View.VISIBLE);

        Button b = findViewById(R.id.sendOtpButton);
        b.setVisibility(View.GONE);

        PhoneAuthOptions options =
                PhoneAuthOptions.newBuilder(mAuth)
                        .setPhoneNumber(phone)       // Phone number to verify
                        .setTimeout(60L, TimeUnit.SECONDS) // Timeout and unit
                        .setActivity(this)                 // Activity (for callback binding)
                        .setCallbacks(mCallbacks)          // OnVerificationStateChangedCallbacks
                        .build();
        PhoneAuthProvider.verifyPhoneNumber(options);
    }

    public void LoginClicked(View view) {
        TextInputEditText passwordInput = findViewById(R.id.otpInput);
        String password = passwordInput.getText().toString();

        TextView v = findViewById(R.id.verificationId);
        String verificationId = v.getText().toString();

        Button b = findViewById(R.id.loginButton);
        b.setVisibility(View.GONE);

        ProgressBar p = findViewById(R.id.progressCircularLogin);
        p.setVisibility(View.VISIBLE);

        PhoneAuthCredential credential = PhoneAuthProvider.getCredential(verificationId, password);
        signInWithPhoneAuthCredential(credential);
    }
    private void signInWithPhoneAuthCredential(PhoneAuthCredential credential) {
        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            //Log.d(TAG, "signInWithCredential:success");

                            FirebaseUser user = task.getResult().getUser();

                            Toast.makeText(LoginActivity.this, "Successfully Logged In", Toast.LENGTH_SHORT).show();

                            Intent intent = new Intent(LoginActivity.this,HomePageActivity.class);
                            startActivity(intent);
                            overridePendingTransition(0,0);
                            // Update UI
                        } else {
                            // Sign in failed, display a message and update the UI
                            //Log.w(TAG, "signInWithCredential:failure", task.getException());
                            if (task.getException() instanceof FirebaseAuthInvalidCredentialsException) {
                                new AlertDialog.Builder(LoginActivity.this)
                                        .setTitle("Error")
                                        .setMessage("Wrong OTP")

                                        .setPositiveButton("Close", new DialogInterface.OnClickListener() {
                                            public void onClick(DialogInterface dialog, int which) {
                                            }
                                        })
                                        .setIcon(android.R.drawable.ic_dialog_alert)
                                        .show();
                                Button b = findViewById(R.id.loginButton);
                                b.setVisibility(View.VISIBLE);

                                ProgressBar p = findViewById(R.id.progressCircularLogin);
                                p.setVisibility(View.GONE);
                                // The verification code entered was invalid
                            }
                        }
                    }
                });
    }
}
