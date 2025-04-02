import { Body, Controller, HttpCode, HttpStatus, Post, Get, Param, Query } from "@nestjs/common";
import { BookletService } from "./booklet.service";
import { BookletDto, ExportDto } from "./dtos";
import { CardService } from "../card/card.service";
import { promisify } from "util";
import * as fs from "fs/promises";
import { Res } from "@nestjs/common";
import * as fsSync from "fs";


@Controller("booklet")
export class BookletController {
  constructor(
    private bookletService: BookletService,
    private cardService: CardService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("/create")
  createBooklet(@Body() bookletDto: BookletDto) {
    return this.bookletService.createBooklet(parseInt(bookletDto.user_id));
  }

  @Get("/get")
  getBooklet(@Body() bookletDto: BookletDto) {
    return this.bookletService.getBooklet(parseInt(bookletDto.user_id));
  }

  @Get("/banned-practices")
  async getBannedPractices(@Query() bookletDto: BookletDto) {
    return this.bookletService.getBannedPractices(parseInt(bookletDto.user_id));
  }

  @Get("/applied-practices")
  async getAppliedPractices(@Query() bookletDto: BookletDto) {
    return this.bookletService.getAppliedPractices(parseInt(bookletDto.user_id));
  }

  @Get("/bad-practice-details")
  async getBadPracticeCardDetails() {
    return this.cardService.getBadPracticeCardDetails();
  }

  @Get("/good-practice-details")
  async getGoodPracticeCardDetails() {
    return this.cardService.getBestPracticeCardDetails();
  }

  @HttpCode(HttpStatus.OK)
  @Post("/addBan/:practiceId")
  async addBanToPractices(@Param("practiceId") practiceId: string, @Body() bookletDto: BookletDto) {
    console.log("[booklet controller] addBanToPractices in controller", bookletDto, parseInt(practiceId));
    console.log("http endpoint is ", HttpCode);
    return this.bookletService.addBanToBooklet(parseInt(bookletDto.user_id), parseInt(practiceId), bookletDto.order);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/removeBan/:practiceId")
  async removeBanFromPractices(@Param("practiceId") practiceId: string, @Body() bookletDto: BookletDto) {
    console.log("[booklet controller] removeBanFromPractices in controller", bookletDto);
    return this.bookletService.removeBanFromBooklet(parseInt(bookletDto.user_id), parseInt(practiceId));
  }

  @HttpCode(HttpStatus.OK)
  @Post("/addApply/:practiceId")
  async addApplyToPractices(@Param("practiceId") practiceId: string, @Body() bookletDto: BookletDto) {
    console.log("[booklet controller] addApplyToPractices in controller", bookletDto, parseInt(practiceId));
    return this.bookletService.addApplyToBooklet(parseInt(bookletDto.user_id), parseInt(practiceId), bookletDto.order);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/removeApply/:practiceId")
  async removeApplyFromPractices(@Param("practiceId") practiceId: string, @Body() bookletDto: BookletDto) {
    console.log("[booklet controller] removeApplyFromPractices in controller", bookletDto);
    return this.bookletService.removeApplyFromBooklet(parseInt(bookletDto.user_id), parseInt(practiceId));
  }

  @HttpCode(HttpStatus.OK)
  @Post("/updatePriority/:practiceId")
  async updatePriority(@Param("practiceId") practiceId: string, @Body() bookletDto: BookletDto) {
    console.log("[booklet controller] updateOrder in controller", bookletDto);
    return this.bookletService.updatePriority(parseInt(bookletDto.user_id), parseInt(practiceId), bookletDto.order, bookletDto.typePractices);
  }

  //Current logic is store temporary file in OS temp directory and return the file path
  //the middleware will handle the download and be trigger in greenIT 
  // the file will be deleted after the download (NEED TO TEST)
  //the generation of the file is done in the service 
  @HttpCode(HttpStatus.OK)
  @Post("/export")
  async exportBooklet(@Body() ExportDto: ExportDto, @Res() res: any) {
    try {
      const os = require('os');
      const path = require('path');

      const tempDir = os.tmpdir(); // Get OS temporary directory
      const filePath = path.join(tempDir, `${ExportDto.filename}.${ExportDto.format === "csv" ? "csv" : "pdf"}`);
      console.log("File path:", filePath);
  
      const fileContent = await this.bookletService.generateFileContent(ExportDto);
      console.log("File content type of", typeof fileContent);

      const fileName = `${ExportDto.filename}.${ExportDto.format}`;

      let contentType = 'text/csv';
      if (ExportDto.format === 'pdf') {
        contentType = 'application/pdf';
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      //on écrit le fichier dans le dossier temporaire
      await fs.writeFile(filePath, fileContent); 
      console.log("File generated successfully:", filePath);

      //on crée un stream pour lire le fichier et le renvoyer au front
      const readStream = fsSync.createReadStream(filePath);
      readStream.pipe(res);

      //remettre le code après debug => supp le fichier après le téléchargement
      readStream.on('finish', () => {
        // suppression du fichier après le téléchargement
        fs.unlink(filePath).catch(console.error);
      }); 

    } catch (error) {
      console.error("Error generating file:", error);
      res.status(500).send("Error generating file");
    }
  }

  

  @Get("/export/fetch/:userId")
  async fetchDataBooklet(@Param("userId") userId: string) {
    console.log("[booklet controller] fetchDataBooklet in controller");
    const bookletData = await this.bookletService.exportBooklet(parseInt(userId));
    
    if (!bookletData) {
      throw new Error("Failed to fetch booklet");
    }
    return bookletData;
    
  }
}
