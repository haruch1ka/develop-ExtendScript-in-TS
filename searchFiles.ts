import { promises as fs } from "fs";
import path from "path";

type SerachFile = {
	dirName: string;
	fileName: string;
	ext: string;
};
const SERACH_EXT_LIST = [".jpg", ".jpeg", ".png"];
export const searchFiles = async (dirPath: string): Promise<SerachFile[]> => {
	const allDirents = await fs.readdir(dirPath, { withFileTypes: true });

	const files: SerachFile[] = [];
	for (const dirent of allDirents) {
		if (dirent.isDirectory()) {
			const newDirPath = path.join(dirPath, dirent.name);
			const newFiles: SerachFile[] = await searchFiles(newDirPath);
			files.push(...newFiles);
		}
		if (dirent.isFile() && SERACH_EXT_LIST.includes(path.extname(dirent.name))) {
			files.push({
				dirName: path.join(dirPath),
				fileName: dirent.name,
				ext: path.extname(dirent.name),
			});
		}
	}
	return files;
};
