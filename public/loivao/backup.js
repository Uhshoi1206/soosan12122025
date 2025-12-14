/**
 * Backup System for Soosan Motor CMS
 * Provides functionality to backup website content via GitHub API
 */

// Configuration
const CONFIG = {
    repo: 'Uhshoi1206/soosan12122025',
    branch: 'main',
    contentPath: 'src/content',
    paths: {
        settings: ['src/content/settings'],
        products: ['src/content/products', 'src/content/categories'],
        blog: ['src/content/blog', 'src/content/blog-categories'],
        banners: ['src/content/banners'],
        full: ['src/content']
    }
};

// State
let isBackupRunning = false;

// Logging utilities
function log(message, type = 'info') {
    const logContainer = document.getElementById('status-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function clearLog() {
    document.getElementById('status-log').innerHTML = '';
}

function showProgress(show = true) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.classList.toggle('active', show);
}

function setProgress(percent) {
    document.getElementById('progress-fill').style.width = `${percent}%`;
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.querySelector('.btn-text').innerHTML = '<span class="spinner"></span> Đang xử lý...';
    } else {
        button.disabled = false;
        const originalText = button.dataset.originalText || button.querySelector('.btn-text').textContent;
        button.querySelector('.btn-text').textContent = originalText;
    }
}

// Get GitHub token from localStorage (set by Sveltia CMS)
function getGitHubToken() {
    // Try Sveltia CMS token storage
    const sveltiaAuth = localStorage.getItem('sveltia-cms.auth');
    if (sveltiaAuth) {
        try {
            const auth = JSON.parse(sveltiaAuth);
            if (auth.token) return auth.token;
        } catch (e) { }
    }

    // Try Netlify CMS token storage
    const netlifyAuth = localStorage.getItem('netlify-cms-user');
    if (netlifyAuth) {
        try {
            const auth = JSON.parse(netlifyAuth);
            if (auth.token) return auth.token;
        } catch (e) { }
    }

    // Try direct token
    const directToken = localStorage.getItem('github-token');
    if (directToken) return directToken;

    return null;
}

// Fetch directory contents recursively from GitHub
async function fetchDirectoryContents(path, token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/contents/${path}?ref=${CONFIG.branch}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }

    return await response.json();
}

// Fetch file content from GitHub
async function fetchFileContent(downloadUrl, token) {
    const response = await fetch(downloadUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3.raw'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
    }

    return await response.text();
}

// Recursively get all files in a directory
async function getAllFiles(path, token, files = []) {
    const contents = await fetchDirectoryContents(path, token);

    for (const item of contents) {
        if (item.type === 'file') {
            files.push({
                path: item.path,
                downloadUrl: item.download_url
            });
        } else if (item.type === 'dir') {
            await getAllFiles(item.path, token, files);
        }
    }

    return files;
}

// Create and download ZIP file
async function createAndDownloadZip(files, token, backupName) {
    const zip = new JSZip();
    const totalFiles = files.length;
    let processed = 0;

    log(`Đang tải ${totalFiles} files...`, 'info');
    showProgress(true);

    for (const file of files) {
        try {
            const content = await fetchFileContent(file.downloadUrl, token);
            zip.file(file.path, content);
            processed++;
            setProgress((processed / totalFiles) * 100);

            if (processed % 10 === 0 || processed === totalFiles) {
                log(`Đã xử lý ${processed}/${totalFiles} files...`, 'info');
            }
        } catch (error) {
            log(`Lỗi khi tải ${file.path}: ${error.message}`, 'warning');
        }
    }

    log('Đang tạo file ZIP...', 'info');

    const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup-${backupName}-${timestamp}.zip`;

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
}

// Generic backup function
async function performBackup(pathsKey, backupName, buttonElement) {
    if (isBackupRunning) {
        log('Đang có backup đang chạy, vui lòng đợi...', 'warning');
        return;
    }

    const button = buttonElement || event.target.closest('button');
    button.dataset.originalText = button.querySelector('.btn-text').textContent;

    try {
        isBackupRunning = true;
        setButtonLoading(button, true);
        clearLog();

        log(`Bắt đầu backup ${backupName}...`, 'info');

        // Get token
        const token = getGitHubToken();
        if (!token) {
            throw new Error('Không tìm thấy GitHub token. Vui lòng đăng nhập CMS trước.');
        }
        log('✓ Đã xác thực token', 'success');

        // Get paths to backup
        const paths = CONFIG.paths[pathsKey];
        let allFiles = [];

        for (const path of paths) {
            log(`Đang quét ${path}...`, 'info');
            try {
                const files = await getAllFiles(path, token);
                allFiles = allFiles.concat(files);
                log(`✓ Tìm thấy ${files.length} files trong ${path}`, 'success');
            } catch (error) {
                log(`⚠ Không thể đọc ${path}: ${error.message}`, 'warning');
            }
        }

        if (allFiles.length === 0) {
            throw new Error('Không tìm thấy file nào để backup');
        }

        log(`Tổng cộng ${allFiles.length} files cần backup`, 'info');

        // Create ZIP and download
        const filename = await createAndDownloadZip(allFiles, token, backupName);

        showProgress(false);
        setProgress(0);
        log(`✓ Backup hoàn tất! File: ${filename}`, 'success');

    } catch (error) {
        log(`✗ Lỗi: ${error.message}`, 'error');
        showProgress(false);
        setProgress(0);
    } finally {
        isBackupRunning = false;
        setButtonLoading(button, false);
    }
}

// Backup functions for each type
async function backupSettings() {
    await performBackup('settings', 'settings');
}

async function backupProducts() {
    await performBackup('products', 'products');
}

async function backupBlog() {
    await performBackup('blog', 'blog');
}

async function backupBanners() {
    await performBackup('banners', 'banners');
}

async function backupFull() {
    await performBackup('full', 'full-website');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    log('Sẵn sàng thực hiện backup. Chọn loại backup bên trên.', 'info');

    // Check token availability
    const token = getGitHubToken();
    if (token) {
        log('✓ Đã tìm thấy GitHub token', 'success');
    } else {
        log('⚠ Chưa có GitHub token. Hãy đăng nhập CMS trước khi backup.', 'warning');
    }
});
