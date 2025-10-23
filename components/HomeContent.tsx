import React from 'react';
import HomeHero from './HomeHero';

export default function HomeContent() {
    return (
        <main>
            <HomeHero />
            <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px' }}>
                {/* Additional shared content can go here */}
                <section style={{ textAlign: 'center', marginTop: 18 }}>
                    <h2 style={{ color: '#1e81f6' }}>Why choose User Auth?</h2>
                    <p style={{ color: '#444', maxWidth: 800, margin: '12px auto' }}>
                        Secure, simple authentication with Google and email/password. Use the header to sign in or register — the layout remains the same before and after login.
                    </p>
                </section>
            </div>
        </main>
    );
}
