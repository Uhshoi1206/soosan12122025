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
        content: ['src/content'], // All CMS content
        full: ['src', 'public', 'scripts', '.github'] // Full source code
    },
    // Root config files to include in full backup
    rootFiles: [
        'astro.config.mjs',
        'package.json',
        'package-lock.json',
        'tailwind.config.ts',
        'tsconfig.json',
        'tsconfig.astro.json',
        'postcss.config.js',
        'eslint.config.js',
        'netlify.toml',
        'components.json'
    ]
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

    // Check for manually saved token
    const manualToken = localStorage.getItem('backup-github-token');
    if (manualToken) return manualToken;

    // Search ALL localStorage keys for anything containing token data
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        if (!value) continue;

        try {
            const parsed = JSON.parse(value);
            if (typeof parsed === 'object' && parsed !== null) {
                // Check common token field names
                const tokenFields = ['token', 'access_token', 'backendToken', 'github_token', 'accessToken'];
                for (const field of tokenFields) {
                    if (parsed[field] && typeof parsed[field] === 'string' && parsed[field].length > 20) {
                        console.log(`Found token in localStorage["${key}"]["${field}"]`);
                        return parsed[field];
                    }
                }
                // Check nested 'user' or 'auth' objects
                for (const subKey of ['user', 'auth', 'data']) {
                    if (parsed[subKey] && typeof parsed[subKey] === 'object') {
                        for (const field of tokenFields) {
                            if (parsed[subKey][field] && typeof parsed[subKey][field] === 'string') {
                                console.log(`Found token in localStorage["${key}"]["${subKey}"]["${field}"]`);
                                return parsed[subKey][field];
                            }
                        }
                    }
                }
            }
        } catch (e) {
            // Check if raw value looks like a GitHub token
            if (value.startsWith('ghp_') || value.startsWith('gho_') || value.startsWith('github_pat_')) {
                return value;
            }
        }
    }

    return null;
}

// Prompt user to enter token manually
function promptForToken() {
    const token = prompt(
        'Không tìm thấy GitHub token tự động.\n\n' +
        'Để backup, bạn cần nhập Personal Access Token (PAT) của GitHub.\n\n' +
        'Cách lấy token:\n' +
        '1. Truy cập: github.com/settings/tokens\n' +
        '2. Chọn "Generate new token (classic)"\n' +
        '3. Đặt tên, chọn quyền "repo" (full control)\n' +
        '4. Copy token và paste vào đây\n\n' +
        'Nhập GitHub Token:'
    );

    if (token && token.trim()) {
        localStorage.setItem('backup-github-token', token.trim());
        return token.trim();
    }
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

// Fetch file content from GitHub with retry
async function fetchFileContent(filePath, token, retries = 3) {
    // Use GitHub API content endpoint instead of raw download URL
    const url = `https://api.github.com/repos/${CONFIG.repo}/contents/${filePath}?ref=${CONFIG.branch}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 403) {
                // Rate limited, wait and retry
                const waitTime = attempt * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Decode base64 content
            if (data.content) {
                return decodeBase64(data.content);
            }

            throw new Error('No content in response');
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
    }
}

// Decode base64 content (handles UTF-8)
function decodeBase64(base64String) {
    // Remove line breaks that GitHub adds
    const cleanBase64 = base64String.replace(/\n/g, '');

    // Decode base64 to binary
    const binaryString = atob(cleanBase64);

    // Convert binary to UTF-8 text
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new TextDecoder('utf-8').decode(bytes);
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
            const content = await fetchFileContent(file.path, token);
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
        let token = getGitHubToken();
        if (!token) {
            log('⚠ Không tìm thấy token tự động, đang yêu cầu nhập thủ công...', 'warning');
            token = promptForToken();
            if (!token) {
                throw new Error('Không có GitHub token. Vui lòng nhập token để tiếp tục.');
            }
            log('✓ Đã nhận token thủ công', 'success');
        } else {
            log('✓ Đã xác thực token', 'success');
        }

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

        // For full backup, also include root config files
        if (pathsKey === 'full' && CONFIG.rootFiles) {
            log('Đang quét các file cấu hình gốc...', 'info');
            for (const filename of CONFIG.rootFiles) {
                allFiles.push({
                    path: filename,
                    downloadUrl: null
                });
            }
            log(`✓ Thêm ${CONFIG.rootFiles.length} file cấu hình`, 'success');
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

async function backupContent() {
    await performBackup('content', 'cms-content');
}

async function backupFull() {
    await performBackup('full', 'source-code');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const accessDenied = document.getElementById('access-denied');
    const mainContent = document.getElementById('main-content');

    // Check token availability for access control
    const token = getGitHubToken();

    if (token) {
        // User has token - show main content
        if (mainContent) mainContent.classList.add('show');
        if (accessDenied) accessDenied.classList.remove('show');

        log('Sẵn sàng thực hiện backup. Chọn loại backup bên trên.', 'info');
        log('✓ Đã tìm thấy GitHub token', 'success');
    } else {
        // No token - show access denied
        if (accessDenied) accessDenied.classList.add('show');
        if (mainContent) mainContent.classList.remove('show');
    }
});
