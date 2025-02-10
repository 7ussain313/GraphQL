export function createProfileTemplate(
    attrs: any,
    totalXP: number,
    currentLevel: number,
    auditData: any,
    formatFileSize: (size: number) => string
) {
    return `
        <div class="profile-main-container">
            <div class="profile-content-wrapper">
                <div class="welcome-message">
                    <h1>Welcome, ${attrs.firstName} ${attrs.lastName}! 👋</h1>
                </div>
                <div class="profile-box personal-info-box">
                    <h2>Profile Information</h2>
                    <div class="profile-info">
                        <p><strong>Gender:</strong> ${attrs.genders}</p>
                        <p><strong>📞 Phone:</strong> ${attrs.PhoneNumber}</p>
                        <p><strong>📜 Degree:</strong> ${attrs.Degree}</p>
                        <p><strong>🌍 Country:</strong> ${attrs.country}</p>
                        <p><strong>🆔 CPR Number:</strong> ${attrs.CPRnumber}</p>
                        <p><strong>📍 City:</strong> ${attrs.addressCity}</p>
                        <p><strong>🎂 Date of Birth:</strong> ${new Date(attrs.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="profile-box xp-box">
                    <h2>User XP</h2>
                    <div class="profile-info">
                        <p><strong>Total XP :</strong> ${formatFileSize(totalXP)}</p>
                    </div>
                </div>
                <div class="profile-box level-box">
                    <h2>User Level</h2>
                    <div class="profile-info">
                        <p><strong>Current Level :</strong> ${currentLevel}</p>
                    </div>
                </div>
                <div class="profile-box audit-box">
                    <h2>Audit Ratio</h2>
                    <div class="profile-info audit-graph">
                        <div class="graph-container"></div>
                        <p><strong>Total Done :</strong> ${formatFileSize(auditData.totalUp)}</p>
                        <p><strong>Total Received :</strong> ${formatFileSize(auditData.totalDown)}</p>
                    </div>
                </div>
                <div class="profile-box projects-box">
                    <h2>Latest Projects XP</h2>
                    <div class="profile-info project-graph">
                        <div class="project-graph-container"></div>
                    </div>
                </div>
                <div class="profile-box progress-box">
                    <h2>XP Progress Over Time</h2>
                    <div class="progress-graph-container"></div>
                </div>
            </div>
        </div>
    `;
}
