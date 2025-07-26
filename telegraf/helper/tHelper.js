const os = require('os');
const si = require('systeminformation');

async function getSystemInfo() {
    const osName = os.type();
    const osVersion = os.release();
    const systemName = os.hostname();

    // RAM Info in GB
    const ramSizeGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const ramUsageGB = ((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(2);

    // Disk Info in GB
    const disks = await si.fsSize();
    const diskInfo = disks.map(disk => ({
        mount: disk.mount,
        sizeGB: (disk.size / (1024 ** 3)).toFixed(2),
        usedGB: (disk.used / (1024 ** 3)).toFixed(2),
        usage: disk.use
    }));

    // CPU Info
    const cpuData = await si.cpu();
    const cpuName = cpuData.brand;

    // CPU Usage
    const cpuUsageData = await si.currentLoad();

    return {
        osName,
        osVersion,
        systemName,
        cpuName,
        ramSizeGB,
        ramUsageGB,
        diskInfo,
        cpuUsage: cpuUsageData.currentLoad.toFixed(2) + '%'
    };
}

module.exports = { getSystemInfo };